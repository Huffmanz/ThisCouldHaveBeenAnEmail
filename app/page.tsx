import StartMeeting from "./components/StartMeeting";
import MeetingInProgress from "./components/MeetingInProgress";
import MeetingEnded from "./components/MeetingEnded";
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
    return <MeetingEnded meeting={meeting} />;
  }

  return <MeetingInProgress meeting={meeting} />;
}
