export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-100">
      <div className="w-full max-w-md px-4 relative z-[1]">{children}</div>
      <div className="absolute top-0 left-0 w-full h-full blur-[100px] bg-[radial-gradient(63.4%_76.22%_at_50%_53.41%,rgba(250,250,250,0)_0%,#FAFAFA_100%)]">
        <div className="rectangle-1 w-[200px] aspect-[1.47/1] rounded-full absolute top-[50%] left-[15%] bg-red-700 opacity-40"></div>
        <div className="rectangle-2 w-[300px] aspect-[1.47/1] rounded-full absolute bottom-[10%] left-[30%] bg-green-700 opacity-40"></div>
        <div className="rectangle-3 w-[150px] aspect-[1.47/1] rounded-full absolute top-[15%] right-[30%] bg-amber-500 opacity-80"></div>
      </div>
    </div>
  );
}
