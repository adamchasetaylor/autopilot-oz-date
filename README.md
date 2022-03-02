# autopilot-oz-date-validator

You might have noticed that Autopilot prefers dates in the Future when the Date field has happened. The following validator will look to see if the date given is the current date based on your preferred timezone (see .env file sample), and if so - it will store the date in memory with the expected year.

1. Deploy Functions using Servereless Toolkit

cd autopilot-oz-date-validator
twilio serverless:deploy

2. Create a Bot from Scratch

https://www.twilio.com/console/autopilot/list 

This example depends on the "greeting" and "goodbye" tasks being setup in your Autopilot bot.


## Validate Times

![Screenshot](/images/TimeValidation.png)

3. Set up the environment variable in your functions environment for TIME_INPUT to the time mask you are expecting (HH:mm is what comes from Twilio.TIME)

4. Update the task "greeting" in your bot

https://www.twilio.com/console/autopilot/{YOUR_BOT}/tasks

greeting

```
{
    "actions": [
        {
            "collect": {
                "name": "collect_date",
                "questions": [
{
                        "question": "When would you like that delivered ('today' or another preferred date)?",
                        "type": "Twilio.DATE",
                        "name": "date"
                    }
                ],
                "on_complete": {
                    "redirect": "https://{YOUR_FUNCTION_URL}/oz_date"
                }
            }
        }
    ]
}

5. This can be combined with ["Prefill"](https://www.twilio.com/docs/autopilot/actions/collect#prefill) to accomdate when task is triggerred and data is provided in trigger.