"""
Notification stubs.

Member 3 can replace this with real Twilio + Slack later.
"""


def send_sms(message: str) -> bool:
    print(f"[SMS] {message}")
    return True


def send_slack(message: str) -> bool:
    print(f"[SLACK] {message}")
    return True

