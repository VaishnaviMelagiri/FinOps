from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import time
import asyncio
from contextlib import suppress
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(str(ROOT_DIR / ".env"), override=True)
load_dotenv(str(ROOT_DIR / ".env.example"), override=False)

app = FastAPI(title="CORA+ FinOps API")

_last_cost_alert_at = 0.0
_last_cost_alert_result = {"triggered": False, "reason": "not_checked_yet"}
_alert_task: asyncio.Task | None = None


def _maybe_send_cost_alert(total_spend: float) -> dict:
    global _last_cost_alert_at

    threshold = float(os.getenv("COST_ALERT_THRESHOLD", "5000"))
    cooldown_seconds = int(os.getenv("COST_ALERT_COOLDOWN_SECONDS", "3600"))
    send_threshold_sms = os.getenv("SEND_THRESHOLD_SMS", "false").lower() == "true"

    if total_spend < threshold:
        return {"triggered": False, "reason": "below_threshold", "threshold": threshold}

    now = time.time()
    if now - _last_cost_alert_at < cooldown_seconds:
        return {"triggered": False, "reason": "cooldown_active", "threshold": threshold}

    if not send_threshold_sms:
        return {
            "triggered": False,
            "reason": "threshold_detected_no_send",
            "threshold": threshold,
            "current_spend": total_spend,
        }

    try:
        from backend.notifications import send_cost_alert
        result = send_cost_alert(total_spend=total_spend, threshold=threshold)
        if result.get("sms_sent") or result.get("slack_sent"):
            _last_cost_alert_at = now
        return {"triggered": bool(result.get("sms_sent") or result.get("slack_sent")), "threshold": threshold, **result}
    except Exception as exc:
        return {"triggered": False, "reason": f"alert_error: {exc}", "threshold": threshold}


async def _cost_alert_monitor() -> None:
    global _last_cost_alert_result

    interval_seconds = int(os.getenv("COST_ALERT_CHECK_INTERVAL_SECONDS", "120"))

    while True:
        try:
            from backend.mock_data import get_dashboard_data
            data = get_dashboard_data()
            _last_cost_alert_result = _maybe_send_cost_alert(data.get("total_spend", 0))
        except Exception as exc:
            _last_cost_alert_result = {"triggered": False, "reason": f"monitor_error: {exc}"}
        await asyncio.sleep(interval_seconds)


@app.on_event("startup")
async def startup_cost_monitor() -> None:
    global _alert_task
    enable_monitor = os.getenv("ENABLE_COST_ALERT_MONITOR", "true").lower() == "true"
    if enable_monitor:
        _alert_task = asyncio.create_task(_cost_alert_monitor())


@app.on_event("shutdown")
async def shutdown_cost_monitor() -> None:
    global _alert_task
    if _alert_task:
        _alert_task.cancel()
        with suppress(asyncio.CancelledError):
            await _alert_task
        _alert_task = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "CORA+ API is running", "version": "1.0"}


@app.get("/api/dashboard")
def dashboard():
    from backend.mock_data import get_dashboard_data
    data = get_dashboard_data()
    data["cost_alert"] = _last_cost_alert_result
    return data


@app.get("/api/recommendations")
def recommendations():
    from backend.mock_data import get_recommendations
    return get_recommendations()


@app.post("/api/chat")
async def chat(body: dict):
    message = body.get("message", "")
    if not message:
        return {"answer": "Ask me about your AWS costs!", "insights": [], "suggestions": ["What's my biggest waste?", "Why did costs spike?"]}
    from backend.agent import ask_cora
    return await ask_cora(message)


@app.post("/api/actions/{action_id}/approve")
def approve(action_id: str):
    from backend.mock_data import approve_action, RECOMMENDATIONS, get_dashboard_data
    result = approve_action(action_id)
    try:
        from backend.notifications import send_action_executed_alert
        if result.get("success"):
            rec = next((r for r in RECOMMENDATIONS if r["id"] == action_id), None)
            if rec:
                action_label = "STOP instance" if rec.get("type") == "stop_idle" else rec.get("type", "OPTIMIZE").replace("_", " ").upper()
                dashboard = get_dashboard_data()
                threshold = float(os.getenv("COST_ALERT_THRESHOLD", "5000"))
                alert_result = send_action_executed_alert(
                    action=action_label,
                    instance_name=rec.get("instance_name", "instance"),
                    recommendation_id=rec.get("id", action_id),
                    monthly_savings=float(rec.get("savings", 0)),
                    current_spend=float(dashboard.get("total_spend", 0)),
                    threshold=threshold,
                )
                result["sms_sent"] = alert_result.get("sms_sent", False)
                result["slack_sent"] = alert_result.get("slack_sent", False)
                result["notification_message"] = alert_result.get("message", "")
            else:
                result["sms_sent"] = False
                result["slack_sent"] = False
    except ImportError:
        pass
    return result


@app.get("/api/actions/log")
def log():
    from backend.mock_data import get_action_log
    return get_action_log()


@app.post("/api/alerts/test")
def test_alert(body: dict | None = None):
    payload = body or {}
    total_spend = float(payload.get("total_spend", 6767))
    threshold = float(payload.get("threshold", os.getenv("COST_ALERT_THRESHOLD", "5000")))

    try:
        from backend.notifications import send_cost_alert
        result = send_cost_alert(total_spend=total_spend, threshold=threshold)
        return {
            "success": bool(result.get("sms_sent") or result.get("slack_sent")),
            "alert": result,
            "input": {"total_spend": total_spend, "threshold": threshold},
        }
    except Exception as exc:
        return {
            "success": False,
            "error": str(exc),
            "input": {"total_spend": total_spend, "threshold": threshold},
        }


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)