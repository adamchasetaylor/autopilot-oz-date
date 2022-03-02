require('google-closure-library');
goog.require('goog.i18n.DateTimeFormat');

const chrono = require('chrono-node');

exports.handler = function (context, event, callback) {
  // Can be used for further comparisions if needed (as we)
  const reference_dt = chrono.parse('today', {
    timezone: 'AEDT',
  });

  // get the Memory from Autopilot Redirect
  const memory = JSON.parse(event.Memory);

  // get user input
  const autopilot_date = memory.twilio.collected_data.collect_date.answers.date.answer;

  let response = new Twilio.Response();
  let actions = [];

  // try GB format first, if fails then use default (default includes tommorow, today, etc)
  const chrono_dt =
    chrono.en.GB.parse(autopilot_date, { forwardDate: false }) || chrono.parse(autopilot_date, { forwardDate: false });

  let chrono_date = chrono_dt[0].start.date();
  if (
    reference_dt[0].start.get('day') == chrono_dt[0].start.get('day') &&
    reference_dt[0].start.get('month') == chrono_dt[0].start.get('month')
  ) {
    chrono_date = reference_dt[0].start.date();
  }

  // format as a friendly date format (you can change this to include time)
  time_formatter = new goog.i18n.DateTimeFormat(goog.i18n.DateTimeFormat.Format.MEDIUM_DATE);

  date = time_formatter.format(chrono_date);

  let remember = {
    remember: {
      date: date,
    },
  };
  let collect = {
    collect: {
      name: 'validate_date',
      questions: [
        {
          name: 'date',
          question: `Just checking, do you mean ${date}?`,
          type: 'Twilio.YES_NO',
          validate: {
            allowed_values: {
              list: ['Yes'],
            },
            on_failure: {
              messages: [
                {
                  say: "I'm sorry, I must have missed that.",
                },
              ],
              repeat_question: false,
            },
            on_success: {
              say: 'Great.',
            },
            max_attempts: {
              redirect: `task://${event.CurrentTask}`,
              num_attempts: 1,
            },
          },
        },
      ],
      on_complete: {
        redirect: 'task://goodbye',
      },
    },
  };
  actions.push(remember);
  actions.push(collect);

  let respObj = {
    actions: actions,
  };

  response.appendHeader('Content-Type', 'application/json');
  response.setBody(respObj);

  callback(null, response);
};
