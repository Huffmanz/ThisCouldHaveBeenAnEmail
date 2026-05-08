import StartMeeting from "./components/StartMeeting";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;

  if (!m) {
    return <StartMeeting />;
  }

  // Screens 2 & 3 — to be implemented
  return <StartMeeting />;
}
