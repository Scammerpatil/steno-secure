export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4">
        Have a question, issue, or feedback? We'd love to hear from you. Reach
        out using the details below or through our support portal.
      </p>

      <div className="bg-base-200 p-4 rounded-lg shadow">
        <div className="mb-2">
          <strong>Email:</strong>{" "}
          <a
            href="mailto:support@example.com"
            className="text-blue-600 underline"
          >
            support@example.com
          </a>
        </div>
        <div className="mb-2">
          <strong>Phone:</strong> +91 98765 43210
        </div>
        <div>
          <strong>Address:</strong> ABC Tech Hub, Bengaluru, India
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          For technical support or bug reports, please include your exam ID and
          registered email for faster resolution.
        </p>
      </div>
    </div>
  );
}
