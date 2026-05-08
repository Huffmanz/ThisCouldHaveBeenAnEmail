import StartMeeting from "./components/StartMeeting";
import MeetingInProgress from "./components/MeetingInProgress";
import { decodeMeeting } from "./lib/meeting";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;

  if (!m) {
    return <StartMeeting />;
  }

  const meeting = decodeMeeting(m);
  if (!meeting) {
    return <StartMeeting />;
  }

  if (meeting.e) {
    // Screen 3 comes next; for now keep fallback behavior.
    return <StartMeeting />;
  }

  return <MeetingInProgress meeting={meeting} />;
}
