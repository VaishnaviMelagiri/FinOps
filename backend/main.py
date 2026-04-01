from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="CORA+ FinOps API")

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
    return get_dashboard_data()


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
    from backend.mock_data import approve_action
    result = approve_action(action_id)
    try:
        from backend.notifications import send_sms, send_slack
        if result.get("success"):
            send_sms(f"CORA: {result['message']}")
            send_slack(f"CORA: {result['message']}")
    except ImportError:
        pass
    return result


@app.get("/api/actions/log")
def log():
    from backend.mock_data import get_action_log
    return get_action_log()


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)