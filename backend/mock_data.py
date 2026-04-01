EC2_INSTANCES = [
    {"id": "i-0a1b2c3d", "name": "web-prod-1", "type": "m5.xlarge", "state": "running", "cpu": 72.4, "cost": 280, "dept": "Engineering"},
    {"id": "i-0b2c3d4e", "name": "test-env-old", "type": "m5.2xlarge", "state": "running", "cpu": 1.2, "cost": 560, "dept": "QA"},
    {"id": "i-0c3d4e5f", "name": "staging-api", "type": "t3.large", "state": "running", "cpu": 3.1, "cost": 140, "dept": "Engineering"},
    {"id": "i-0d4e5f6g", "name": "ml-training-gpu", "type": "p3.2xlarge", "state": "running", "cpu": 89.0, "cost": 1840, "dept": "Data Science"},
    {"id": "i-0e5f6g7h", "name": "legacy-worker", "type": "c5.xlarge", "state": "running", "cpu": 0.4, "cost": 320, "dept": "Ops"},
    {"id": "i-0f6g7h8i", "name": "dev-sandbox", "type": "t3.medium", "state": "running", "cpu": 2.8, "cost": 85, "dept": "Engineering"},
    {"id": "i-0g7h8i9j", "name": "monitoring-stack", "type": "t3.small", "state": "running", "cpu": 45.0, "cost": 42, "dept": "Ops"},
]

COST_TREND = [
    {"date": "Mar 01", "total": 420, "ec2": 280, "rds": 90, "s3": 30, "other": 20},
    {"date": "Mar 04", "total": 390, "ec2": 260, "rds": 85, "s3": 28, "other": 17},
    {"date": "Mar 07", "total": 445, "ec2": 300, "rds": 92, "s3": 32, "other": 21},
    {"date": "Mar 10", "total": 410, "ec2": 275, "rds": 88, "s3": 29, "other": 18},
    {"date": "Mar 13", "total": 680, "ec2": 310, "rds": 280, "s3": 55, "other": 35},
    {"date": "Mar 17", "total": 1240, "ec2": 360, "rds": 720, "s3": 95, "other": 65},
    {"date": "Mar 20", "total": 890, "ec2": 320, "rds": 420, "s3": 90, "other": 60},
    {"date": "Mar 23", "total": 650, "ec2": 290, "rds": 240, "s3": 75, "other": 45},
    {"date": "Mar 26", "total": 520, "ec2": 270, "rds": 150, "s3": 60, "other": 40},
    {"date": "Mar 29", "total": 480, "ec2": 265, "rds": 120, "s3": 55, "other": 40},
]

SERVICE_SPEND = [
    {"service": "EC2", "spend": 3267, "change": 5.2},
    {"service": "RDS", "spend": 1840, "change": 196.0},
    {"service": "S3", "spend": 420, "change": -2.1},
    {"service": "Lambda", "spend": 89, "change": 12.0},
    {"service": "CloudFront", "spend": 310, "change": 0.5},
    {"service": "EBS", "spend": 560, "change": 8.3},
]

RECOMMENDATIONS = [
    {"id": "rec-001", "type": "stop_idle", "instance_name": "test-env-old", "instance_id": "i-0b2c3d4e", "reason": "CPU avg 1.2% for 7 days — completely idle", "savings": 560, "risk": "low", "status": "pending"},
    {"id": "rec-002", "type": "stop_idle", "instance_name": "legacy-worker", "instance_id": "i-0e5f6g7h", "reason": "CPU avg 0.4% for 7 days — no active workload", "savings": 320, "risk": "medium", "status": "pending"},
    {"id": "rec-003", "type": "stop_idle", "instance_name": "staging-api", "instance_id": "i-0c3d4e5f", "reason": "CPU avg 3.1% for 7 days — staging not in use", "savings": 140, "risk": "low", "status": "pending"},
    {"id": "rec-004", "type": "stop_idle", "instance_name": "dev-sandbox", "instance_id": "i-0f6g7h8i", "reason": "CPU avg 2.8% for 7 days — developer on leave", "savings": 85, "risk": "low", "status": "pending"},
    {"id": "rec-005", "type": "reserved_instance", "instance_name": "ml-training-gpu", "instance_id": "i-0d4e5f6g", "reason": "Running 24/7 at 89% CPU — 1yr RI saves 40%", "savings": 736, "risk": "low", "status": "pending"},
]

action_log = []

def get_idle():
    return [i for i in EC2_INSTANCES if i["state"] == "running" and i["cpu"] < 5.0]

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
        "idle_instances": [{"name": i["name"], "id": i["id"], "cpu": i["cpu"], "cost": i["cost"]} for i in idle],
        "anomalies": ["RDS spiked 196% on Mar 17 — 3 auto read replicas ran 8 days, extra $1,840"],
        "top_spender": "ml-training-gpu (p3.2xlarge) at $1,840/mo — 89% CPU, justified",
    }

def approve_action(action_id):
    for r in RECOMMENDATIONS:
        if r["id"] == action_id and r["status"] == "pending":
            r["status"] = "approved"
            for i in EC2_INSTANCES:
                if i["id"] == r["instance_id"]:
                    i["state"] = "stopped"
                    i["cpu"] = 0
            action_log.append({"id": r["id"], "name": r["instance_name"], "savings": r["savings"], "action": f"Stopped {r['instance_name']}"})
            return {"success": True, "savings": r["savings"], "message": f"Stopped {r['instance_name']} — saving ${r['savings']}/mo"}
    return {"success": False, "message": "Action not found or already approved"}

def get_action_log():
    return action_log