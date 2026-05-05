def create_player(payload):
    """
    domainspec:
      concept:
        id: player-management.CreatePlayer
        type: Operation
        concern: biz
      edges:
        - edge: produces
          to: player-management.PlayerCreated
    """
    return {"ok": True, "payload": payload}
