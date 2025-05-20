export default function FeaturesPage() {
  const features = [
    {
      title: "Secure Online Exams",
      desc: "Role-based access, session isolation, and fraud detection ensure a secure exam environment.",
    },
    {
      title: "AI Violation Detection",
      desc: "Automatically detects screen switching, multiple faces, and inactivity to maintain integrity.",
    },
    {
      title: "Realtime Result Analytics",
      desc: "Get instant insights into performance, violations, and time taken per question.",
    },
    {
      title: "Multi-Attempt Support",
      desc: "Users can attempt exams multiple times with historical results and stats per attempt.",
    },
    {
      title: "Admin Dashboard",
      desc: "Manage exams, users, questions, and view global metrics in one place.",
    },
    {
      title: "Mobile Friendly UI",
      desc: "Fully responsive design ensures usability across all devices, including tablets and phones.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Platform Features</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-base-200 p-4 rounded-lg shadow hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-base-content/70">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
