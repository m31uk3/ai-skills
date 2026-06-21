# Example Harnesses for ggs (synchronizing-grok-convos)

## macOS launchd (recommended for users)

Create `~/Library/LaunchAgents/com.m31uk3.ggs-sync.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.m31uk3.ggs-sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/your/synchronizing-grok-convos/bin/ggs</string>
        <string>--sync</string>
    </array>
    <key>StartInterval</key>
    <integer>3600</integer> <!-- every hour -->
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/ggs-sync.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/ggs-sync.err</string>
</dict>
</plist>
```

Load:
```bash
launchctl load ~/Library/LaunchAgents/com.m31uk3.ggs-sync.plist
```

## Simple cron (Linux/macOS)

```cron
0 * * * * /path/to/ggs --sync >> /tmp/ggs-sync.log 2>&1
```

## TUI / Grok scheduling note

You can invoke the skill directly from the Grok TUI on a schedule if your setup supports background skills, or wrap `ggs` in a small script that the TUI can trigger.

## Shell wrapper example

```bash
#!/bin/bash
# ~/bin/ggs-sync
cd ~/github/m31uk3/ai-skills/skills/synchronizing-grok-convos || exit 1
./bin/ggs --sync "$@"
```

Make executable and add to PATH.
