import os
from pathlib import Path

import httpx
from dotenv import load_dotenv
from twilio.rest import Client

ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(str(ROOT_DIR / ".env"), override=True)
load_dotenv(str(ROOT_DIR / ".env.example"), override=False)


def send_sms(message: str) -> bool:
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_FROM_PHONE")
    to_number = os.getenv("TWILIO_TO_PHONE")

    if not all([account_sid, auth_token, from_number, to_number]):
        print("[SMS] Twilio config missing. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_PHONE, TWILIO_TO_PHONE")
        return False

    try:
        client = Client(account_sid, auth_token)
        client.messages.create(body=message, from_=from_number, to=to_number)
        return True
    except Exception as exc:
        print(f"[SMS] Twilio send failed: {exc}")
        return False


def send_slack(message: str) -> bool:
    webhook_url = os.getenv("SLACK_WEBHOOK_URL")
    if not webhook_url:
        print("[SLACK] Missing SLACK_WEBHOOK_URL")
        return False

    try:
        response = httpx.post(webhook_url, json={"text": message}, timeout=10.0)
        response.raise_for_status()
        return True
    except Exception as exc:
        print(f"[SLACK] Slack send failed: {exc}")
        return False


def send_cost_alert(total_spend: float, threshold: float, currency: str = "$") -> dict:
    message = (
        "CORA Cost Alert: Monthly cloud spend exceeded threshold. "
        f"Current spend: {currency}{total_spend:,.2f}. "
        f"Threshold: {currency}{threshold:,.2f}."
    )
    sms_sent = send_sms(message)
    slack_sent = send_slack(message)
    return {"sms_sent": sms_sent, "slack_sent": slack_sent, "message": message}


def format_action_alert(
    action: str,
    instance_name: str,
    recommendation_id: str,
    monthly_savings: float,
    current_spend: float,
    threshold: float,
    status: str = "EXECUTED",
) -> str:
    review_url = os.getenv("FINOPS_REVIEW_URL", "https://cora-finops.vercel.app")
    return (
        "CORA+ FinOps Alert\n"
        "-------------------\n"
        f"Action: {action}\n"
        f"Instance: {instance_name} ({recommendation_id})\n"
        f"Monthly Savings: ${monthly_savings:,.0f}/mo\n"
        f"Current Spend: ${current_spend:,.0f}/mo\n"
        f"Threshold: ${threshold:,.0f}/mo\n"
        f"Status: {status}\n"
        "-------------------\n"
        f"Review: {review_url}"
    )


def send_action_executed_alert(
    action: str,
    instance_name: str,
    recommendation_id: str,
    monthly_savings: float,
    current_spend: float,
    threshold: float,
) -> dict:
    message = format_action_alert(
        action=action,
        instance_name=instance_name,
        recommendation_id=recommendation_id,
        monthly_savings=monthly_savings,
        current_spend=current_spend,
        threshold=threshold,
        status="EXECUTED",
    )
    # Send only one message channel by default to avoid duplicate alerts.
    sms_sent = send_sms(message)
    slack_sent = False
    return {"sms_sent": sms_sent, "slack_sent": slack_sent, "message": message}

