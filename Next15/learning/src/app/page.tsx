import Link from "next/link";

export default function Home() {
  const hooks = [
    {
      id: "use-state-hook",
      title: "useState Hook",
    },
    {
      id: "use-reducer-hook",
      title: "useReducer Hook",
    },
    {
      id: "use-context-hook",
      title: "useContext Hook",
    },
  ];

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-12 text-center">
        <h1 className="text-3xl font-bold mb-2">React Hooks</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select a hook to learn more
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hooks.map((hook) => (
            <li
              key={hook.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/hooks/${hook.id}`} className="block h-full p-6">
                <h2 className="text-xl font-semibold mb-2">{hook.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
