# ---------- EC2 INSTANCES ----------
EC2_INSTANCES = [
    {"id": "i-0a1b2c3d4e5f6789a", "name": "web-prod-1", "type": "m5.xlarge", "state": "running", "cpu": 72.4, "cost": 280, "department": "Engineering", "region": "us-east-1"},
    {"id": "i-0b2c3d4e5f6789a1b", "name": "test-env-old", "type": "m5.2xlarge", "state": "running", "cpu": 1.2, "cost": 560, "department": "QA", "region": "us-east-1"},
    {"id": "i-0c3d4e5f6789a1b2c", "name": "staging-api", "type": "t3.large", "state": "running", "cpu": 3.1, "cost": 140, "department": "Engineering", "region": "us-east-1"},
    {"id": "i-0d4e5f6789a1b2c3d", "name": "ml-training-gpu", "type": "p3.2xlarge", "state": "running", "cpu": 89.0, "cost": 1840, "department": "Data Science", "region": "us-east-1"},
    {"id": "i-0e5f6789a1b2c3d4e", "name": "legacy-worker", "type": "c5.xlarge", "state": "running", "cpu": 0.4, "cost": 320, "department": "Ops", "region": "us-east-1"},
    {"id": "i-0f6789a1b2c3d4e5f", "name": "dev-sandbox", "type": "t3.medium", "state": "running", "cpu": 2.8, "cost": 85, "department": "Engineering", "region": "ap-south-1"},
    {"id": "i-0g789a1b2c3d4e5f6", "name": "monitoring-stack", "type": "t3.small", "state": "running", "cpu": 45.0, "cost": 42, "department": "Ops", "region": "us-east-1"},
    {"id": "i-0h89ab1c2d3e4f5g6", "name": "payments-worker-1", "type": "c6i.large", "state": "running", "cpu": 58.7, "cost": 190, "department": "Finance", "region": "us-east-1"},
    {"id": "i-0i9abc1d2e3f4g5h6", "name": "batch-etl-nightly", "type": "m5.large", "state": "running", "cpu": 4.6, "cost": 155, "department": "Data Science", "region": "us-west-2"},
    {"id": "i-0jabc12d3e4f5g6h7", "name": "customer-support-api", "type": "t3.large", "state": "running", "cpu": 22.9, "cost": 135, "department": "Support", "region": "eu-west-1"},
    {"id": "i-0kbc123d4e5f6g7h8", "name": "qa-loadgen", "type": "c5.2xlarge", "state": "running", "cpu": 5.0, "cost": 210, "department": "QA", "region": "us-east-2"},
    {"id": "i-0lcd234e5f6g7h8i9", "name": "old-reporting-box", "type": "m4.large", "state": "stopped", "cpu": 0.2, "cost": 0, "department": "Finance", "region": "us-east-1"},
    {"id": "i-0mde345f6g7h8i9j0", "name": "analytics-sandbox", "type": "r5.large", "state": "running", "cpu": 1.9, "cost": 230, "department": "Data Science", "region": "ap-south-1"},
]

# ---------- DAILY COST TREND ----------
COST_TREND = [
    {"date": "Feb 22", "total": 402, "ec2": 255, "rds": 84},
    {"date": "Feb 25", "total": 418, "ec2": 268, "rds": 90},
    {"date": "Feb 28", "total": 409, "ec2": 262, "rds": 87},
    {"date": "Mar 01", "total": 420, "ec2": 280, "rds": 90},
    {"date": "Mar 04", "total": 390, "ec2": 260, "rds": 85},
    {"date": "Mar 07", "total": 445, "ec2": 300, "rds": 95},
    {"date": "Mar 10", "total": 410, "ec2": 275, "rds": 88},
    {"date": "Mar 13", "total": 680, "ec2": 310, "rds": 290},
    {"date": "Mar 17", "total": 1240, "ec2": 360, "rds": 740},
    {"date": "Mar 20", "total": 890, "ec2": 320, "rds": 420},
    {"date": "Mar 23", "total": 650, "ec2": 290, "rds": 210},
    {"date": "Mar 26", "total": 520, "ec2": 270, "rds": 140},
    {"date": "Mar 29", "total": 480, "ec2": 265, "rds": 110},
    {"date": "Mar 31", "total": 505, "ec2": 278, "rds": 118},
    {"date": "Apr 01", "total": 498, "ec2": 272, "rds": 115},
]

# ---------- SERVICE BREAKDOWN ----------
SERVICE_SPEND = [
    {"service": "EC2", "spend": 3267, "change": 5.2},
    {"service": "RDS", "spend": 1840, "change": 196.0},
    {"service": "S3", "spend": 420, "change": -2.1},
    {"service": "Lambda", "spend": 89, "change": 12.0},
    {"service": "CloudFront", "spend": 310, "change": 0.5},
    {"service": "EBS", "spend": 560, "change": 8.3},
    {"service": "NAT Gateway", "spend": 145, "change": 9.8},
    {"service": "CloudWatch", "spend": 72, "change": 6.4},
    {"service": "Elastic IP", "spend": 36, "change": 21.1},
    {"service": "Secrets Manager", "spend": 28, "change": 3.3},
]

# ---------- RECOMMENDATIONS ----------
RECOMMENDATIONS = [
    {"id": "rec-001", "type": "stop_idle", "instance_name": "test-env-old", "instance_id": "i-0b2c3d4e5f6789a1b", "reason": "CPU avg 1.2% for 7 days - completely idle", "savings": 560, "risk": "low", "status": "pending"},
    {"id": "rec-002", "type": "stop_idle", "instance_name": "legacy-worker", "instance_id": "i-0e5f6789a1b2c3d4e", "reason": "CPU avg 0.4% for 7 days - no active workload", "savings": 320, "risk": "medium", "status": "pending"},
    {"id": "rec-003", "type": "stop_idle", "instance_name": "staging-api", "instance_id": "i-0c3d4e5f6789a1b2c", "reason": "CPU avg 3.1% for 7 days - staging not in use", "savings": 140, "risk": "low", "status": "pending"},
    {"id": "rec-004", "type": "stop_idle", "instance_name": "dev-sandbox", "instance_id": "i-0f6789a1b2c3d4e5f", "reason": "CPU avg 2.8% for 7 days - developer offline", "savings": 85, "risk": "low", "status": "pending"},
    {"id": "rec-005", "type": "reserved_instance", "instance_name": "ml-training-gpu", "instance_id": "i-0d4e5f6789a1b2c3d", "reason": "Running 24/7 at 89% CPU - 1yr RI saves 40%", "savings": 736, "risk": "low", "status": "pending"},
    {"id": "rec-006", "type": "stop_idle", "instance_name": "analytics-sandbox", "instance_id": "i-0mde345f6g7h8i9j0", "reason": "CPU avg 1.9% for 10 days - sandbox unused", "savings": 230, "risk": "low", "status": "pending"},
    {"id": "rec-007", "type": "rightsize", "instance_name": "payments-worker-1", "instance_id": "i-0h89ab1c2d3e4f5g6", "reason": "Over-provisioned for current load profile", "savings": 70, "risk": "medium", "status": "pending"},
    {"id": "rec-008", "type": "schedule_shutdown", "instance_name": "qa-loadgen", "instance_id": "i-0kbc123d4e5f6g7h8", "reason": "Runs only during office hours", "savings": 95, "risk": "low", "status": "pending"},
    {"id": "rec-009", "type": "stop_idle", "instance_name": "old-reporting-box", "instance_id": "i-0lcd234e5f6g7h8i9", "reason": "Already stopped, recommendation stale", "savings": 0, "risk": "low", "status": "approved"},
    {"id": "rec-010", "type": "delete_snapshots", "instance_name": "legacy-worker", "instance_id": "i-0e5f6789a1b2c3d4e", "reason": "Orphaned snapshots older than 90 days", "savings": 40, "risk": "low", "status": "rejected"},
    {"id": "rec-011", "type": "stop_idle", "instance_name": "batch-etl-nightly", "instance_id": "i-0i9abc1d2e3f4g5h6", "reason": "CPU avg 4.6% and no daily scheduler hit in 5 days", "savings": 155, "risk": "medium", "status": "pending"},
    {"id": "rec-012", "type": "rightsize", "instance_name": "customer-support-api", "instance_id": "i-0jabc12d3e4f5g6h7", "reason": "Traffic profile supports t3.medium during non-peak windows", "savings": 55, "risk": "low", "status": "pending"},
    {"id": "rec-013", "type": "reserved_instance", "instance_name": "web-prod-1", "instance_id": "i-0a1b2c3d4e5f6789a", "reason": "Steady baseline load suitable for 1-year no-upfront", "savings": 84, "risk": "low", "status": "pending"},
    {"id": "rec-014", "type": "s3_lifecycle", "instance_name": "legacy-worker", "instance_id": "i-0e5f6789a1b2c3d4e", "reason": "Move old logs to Glacier after 30 days", "savings": 18, "risk": "low", "status": "pending"},
    {"id": "rec-015", "type": "cloudwatch_retention", "instance_name": "monitoring-stack", "instance_id": "i-0g789a1b2c3d4e5f6", "reason": "Reduce log retention from 90 to 30 days", "savings": 22, "risk": "low", "status": "pending"},
]

# ---------- ACTION LOG ----------
action_log = []

# ---------- HELPER FUNCTIONS ----------
IDLE_THRESHOLD = 5.0

def get_idle():
    return [i for i in EC2_INSTANCES if i["state"] == "running" and i["cpu"] < IDLE_THRESHOLD]

def get_dashboard_data():
    running = [i for i in EC2_INSTANCES if i["state"] == "running"]
    idle = get_idle()
    pending = [r for r in RECOMMENDATIONS if r["status"] == "pending"]
    return {
        "total_spend": sum(s["spend"] for s in SERVICE_SPEND),
        "ec2_spend": sum(i["cost"] for i in running),
        "ec2_running": len(running),
        "idle_count": len(idle),
        "potential_savings": sum(r["savings"] for r in pending),
        "actions_taken": len(action_log),
        "total_saved": sum(a["savings"] for a in action_log),
        "recommendation_count": len(RECOMMENDATIONS),
        "pending_count": len(pending),
        "cost_trend": COST_TREND,
        "service_spend": SERVICE_SPEND,
        "instances": EC2_INSTANCES,
    }

def get_recommendations():
    return [r for r in RECOMMENDATIONS if r["status"] == "pending"]

def get_summary():
    idle = get_idle()
    running = [i for i in EC2_INSTANCES if i["state"] == "running"]
    return {
        "total_spend": sum(s["spend"] for s in SERVICE_SPEND),
        "ec2_spend": sum(i["cost"] for i in running),
        "ec2_running": len(running),
        "idle_instances": [{"name": i["name"], "id": i["id"], "cost": i["cost"], "cpu": i["cpu"]} for i in idle],
        "anomalies": [
            "RDS spiked 196% on Mar 17 - 3 auto-created read replicas ran for 8 days",
            "NAT Gateway costs rose 9.8% due to increased cross-AZ traffic",
            "Elastic IP charges climbed 21.1% from unattached addresses",
        ],
        "risk_flags": [
            "5 high-cost instances are running continuously",
            "4+ idle or near-idle instances are still active",
            "Multiple low-risk optimizations are pending approval",
        ],
        "top_spender": "ml-training-gpu (p3.2xlarge) at $1,840/mo",
    }

def approve_action(action_id: str):
    for r in RECOMMENDATIONS:
        if r["id"] == action_id:
            if r["status"] == "approved":
                return {"success": False, "message": "Action already approved"}

            r["status"] = "approved"

            action_text = f"Approved action for {r['instance_name']}"
            if r["type"] == "stop_idle":
                for i in EC2_INSTANCES:
                    if i["id"] == r["instance_id"]:
                        i["state"] = "stopped"
                        i["cpu"] = 0
                        break
                action_text = f"Stopped {r['instance_name']}"

            action_log.append({
                "id": r["id"],
                "type": r["type"],
                "name": r["instance_name"],
                "savings": r["savings"],
                "action": action_text,
            })

            return {
                "success": True,
                "savings": r["savings"],
                "message": f"Approved {r['instance_name']} - saving ${r['savings']}/mo",
                "sms_sent": True,
            }
    return {"success": False, "message": "Action not found"}

def get_action_log():
    return action_log