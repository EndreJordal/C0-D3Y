import { google } from "googleapis";

const calendarData = {
  A: {
    url: "https://calendar.google.com/calendar/u/0?cid=Y19vZ2xmOTE0NTIyMjU0ZGkydmYxY2oyNnIwc0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    id: "c_oglf914522254di2vf1cj26r0s@group.calendar.google.com",
  },
  B: {
    url: "https://calendar.google.com/calendar/u/0?cid=Y192NGg5YjJuOTR0ZjFydjY1M2hyZXVhcTZrZ0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    id: "c_v4h9b2n94tf1rv653hreuaq6kg@group.calendar.google.com",
  },
  C: {
    url: "https://calendar.google.com/calendar/u/0?cid=Y19xMzlvNjMyYmFsMWQ1YW41ODBtZWZ0cW9wa0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    id: "c_q39o632bal1d5an580meftqopk@group.calendar.google.com",
  },
  D: {
    url: "https://calendar.google.com/calendar/u/0?cid=Y19zZTUwM3BhbzQ4anV1YnVpaGNwaGJidXRtc0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    id: "c_se503pao48juubuihcphbbutms@group.calendar.google.com",
  },
  E: {
    url: "https://calendar.google.com/calendar/u/0?cid=Y18yODFyM3JiNTU2MzFrdjU4aXN2Y3NrNXUzb0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    id: "c_281r3rb55631kv58isvcsk5u3o@group.calendar.google.com",
  },
  S: {
    url: "https://calendar.google.com/calendar/u/0?cid=Y19vZ2xmOTE0NTIyMjU0ZGkydmYxY2oyNnIwc0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    id: "c_oglf914522254di2vf1cj26r0s@group.calendar.google.com",
  },
};

/////////////////////////////

const fetchCalendar = async (calendarId) => {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  const calendar = google.calendar({ version: "v3", auth });

  try {
    // A helper function to get the start or end of a given date
    const getDayBoundary = (date, isEnd) =>
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        isEnd ? 23 : 0,
        isEnd ? 59 : 0,
        isEnd ? 59 : 0
      );
    // A helper function to format the date and time
    const formatDateTime = (dateTime) => {
      if (dateTime) {
        // Slice the dateTime string to get the hours and minutes
        let hours = dateTime.slice(11, 13);
        let minutes = dateTime.slice(14, 16);
        // Return the formatted time as HH:MM
        return `${hours}:${minutes}`;
      } else {
        return "";
      }
    };
    // Get the current date
    const today = new Date();
    const res = await calendar.events.list({
      calendarId: calendarId,
      timeMin: getDayBoundary(today).toISOString(), // Specify the start of the day as the minimum start time for events
      timeMax: getDayBoundary(today, true).toISOString(), // Specify the end of the day as the maximum end time for events
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = res.data.items;
    if (events.length) {
      let dailySchedule = "";
      events.forEach(({ start, end, summary }) => {
        // Get the start and end time of each event and format them
        const startTime = formatDateTime(start.dateTime || start.date);
        const endTime = formatDateTime(end.dateTime || end.date);
        dailySchedule += `* ${startTime} - ${endTime} : ${summary}\n`;
      });
      return `### Her din timeplan for i dag:\n${dailySchedule}`;
    } else {
      return "Ingenting på timeplanen i dag!";
    }
  } catch (err) {
    return (
      "Oi! Her skjedde en feil, ta kontakt med botutvikler Endre." + err.message
    );
  }
};

export { calendarData, fetchCalendar };
