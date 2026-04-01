import httpx
import json
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"


def get_aws_context():
    try:
        from mock_data import get_summary
        return json.dumps(get_summary(), indent=2)
    except:
        return '{"total_spend": 6606, "idle_instances": [{"name": "test-env-old", "cost": 560}]}'


SYSTEM_PROMPT = """You are CORA (Cloud Optimization & Remediation Agent), an AI FinOps assistant.

CURRENT AWS DATA:
{context}

ANOMALY DETAILS:
- RDS spiked 196% on Mar 17: Multi-AZ failover auto-created 3 db.r5.xlarge read replicas. Ran 8 days. Extra cost: $1,840.
- S3 spiked 85% on Mar 13: ML team uploaded 2.3TB to S3 Standard without lifecycle policy. Extra cost: $320.

RULES:
- Use actual names, IDs, dollar amounts from the data
- Idle = CPU below 5% for 7 days
- Be specific with numbers
- Be concise

RESPOND IN THIS EXACT JSON FORMAT ONLY (no markdown, no backticks):
{{"answer": "main explanation with numbers", "insights": ["insight 1", "insight 2"], "suggestions": ["suggestion 1", "suggestion 2"]}}"""


async def call_claude(message):
    context = get_aws_context()
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
    }
    payload = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 1024,
        "system": SYSTEM_PROMPT.format(context=context),
        "messages": [{"role": "user", "content": message}],
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(ANTHROPIC_URL, headers=headers, json=payload)
        resp.raise_for_status()
        text = resp.json()["content"][0]["text"].strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        return json.loads(text)


def offline_response(message):
    q = message.lower()
    try:
        from mock_data import get_summary
        summary = get_summary()
        idle = summary.get("idle_instances", [])
    except:
        idle = [{"name": "test-env-old", "cpu": 1.2, "cost": 560}, {"name": "legacy-worker", "cpu": 0.4, "cost": 320}, {"name": "staging-api", "cpu": 3.1, "cost": 140}, {"name": "dev-sandbox", "cpu": 2.8, "cost": 85}]

    waste = sum(i["cost"] for i in idle)

    if any(w in q for w in ["idle", "waste", "unused", "biggest waste", "wasting"]):
        return {
            "answer": f"Found {len(idle)} idle EC2 instances (CPU < 5%) wasting ${waste:,}/mo. Biggest offender: test-env-old (m5.2xlarge, CPU 1.2%) costing $560/mo for nothing.",
            "insights": [f"{i['name']}: CPU {i['cpu']}%, costing ${i['cost']}/mo" for i in idle],
            "suggestions": [f"Stop all {len(idle)} idle instances to save ${waste:,}/mo", "Approve actions in the Optimize tab", "Set up CloudWatch idle detection alarms"],
        }

    if any(w in q for w in ["spike", "surge", "why", "rds", "jump", "increase"]):
        return {
            "answer": "RDS spend spiked 196% on March 17. Root cause: Multi-AZ failover auto-created 3 db.r5.xlarge read replicas that ran 8 days unnoticed. Extra cost: $1,840.",
            "insights": ["3 read replicas auto-created during failover on Mar 17", "Ran 8 days — no alarms were set", "Extra cost: $1,840 above baseline", "S3 also spiked 85% from 2.3TB ML upload without lifecycle policy"],
            "suggestions": ["Set CloudWatch alarm for RDS instance count", "Enable AWS Cost Anomaly Detection", "Add S3 lifecycle policy for ML buckets"],
        }

    if any(w in q for w in ["cost", "spend", "bill", "total", "how much", "summary", "overview"]):
        return {
            "answer": f"Total monthly spend: $6,606. EC2 is biggest at $3,267/mo (49%), then RDS at $1,840/mo (28%). You have 7 running instances, {len(idle)} are idle wasting ${waste}/mo.",
            "insights": ["EC2: $3,267/mo (7 instances, 4 idle)", "RDS: $1,840/mo (includes spike)", "S3: $420/mo", f"Idle waste: ${waste}/mo", "Top spender: ml-training-gpu $1,840/mo (89% CPU — justified)"],
            "suggestions": [f"Stop idle instances → save ${waste}/mo", "Buy RI for ml-training → save $736/mo", "Enable S3 Intelligent Tiering → save $80/mo"],
        }

    if any(w in q for w in ["optimize", "save", "recommend", "fix", "reduce", "cut"]):
        total_save = waste + 736 + 80 + 105
        return {
            "answer": f"Top optimizations: Stop {len(idle)} idle EC2s (${waste}/mo), buy RI for ml-training ($736/mo), S3 tiering ($80/mo), right-size staging ($105/mo). Total: ${total_save}/mo.",
            "insights": [f"Idle cleanup: ${waste}/mo", "RI for ml-training: $736/mo", "S3 tiering: $80/mo", "Right-size staging-api: $105/mo", f"Total potential: ${total_save}/mo"],
            "suggestions": ["Approve idle stops in Optimize tab", "Purchase 1yr RI for p3.2xlarge", "Set S3 lifecycle policy on training-data bucket"],
        }

    return {
        "answer": f"I'm CORA, your FinOps agent. Your account spends $6,606/mo with {len(idle)} idle instances wasting ${waste}/mo. Ask me about waste, spikes, or optimizations!",
        "insights": [f"Spend: $6,606/mo", f"Idle waste: ${waste}/mo", "1 active anomaly: RDS spike"],
        "suggestions": ["What's my biggest waste?", "Why did costs spike?", "How can I save money?", "Give me a cost summary"],
    }


async def ask_cora(message):
    if not ANTHROPIC_API_KEY or "paste" in ANTHROPIC_API_KEY:
        return offline_response(message)
    try:
        result = await call_claude(message)
        if "answer" in result:
            return result
        return offline_response(message)
    except Exception as e:
        print(f"Claude error: {e}, using offline mode")
        return offline_response(message)