import { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contacts = useMemo(
    () => [
      {
        label: t("contact.labels.phone"),
        value: "+387 51 211 840",
        icon: "📞",
      },
      {
        label: t("contact.labels.phone"),
        value: "+387 51 462 241",
        icon: "📞",
      },
      {
        label: t("contact.labels.address"),
        value: "Landsberg am Lech, Germany",
        icon: "📍",
      },
    ],
    [t],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isEmailValid = /^\S+@\S+\.\S+$/.test(formData.email);
    const allFieldsFilled = Object.values(formData).every(
      (value) => value.trim().length > 0,
    );

    if (!allFieldsFilled || !isEmailValid) {
      setIsError(true);
      setStatusMessage(t("contact.validationError"));
      return;
    }

    setIsSubmitting(true);
    setIsError(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setStatusMessage(t("contact.success"));
      setFormData(initialFormState);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-14 md:py-20 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            {t("contact.title")}
          </h2>
          <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">
            {t("contact.description")}
          </p>

          <div className="space-y-4 mb-6 md:mb-8 rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-green-100 p-2.5 rounded-full mr-3 text-lg md:text-xl">
                  {contact.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg">
                    {contact.label}
                  </h3>
                  {contact.label === t("contact.labels.phone") ? (
                    <a
                      href={`tel:${contact.value.replace(/\s+/g, "")}`}
                      className="text-gray-600 mt-1 block hover:underline"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 mt-1">{contact.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-72 md:h-96">
            <iframe
              src="https://www.google.com/maps?q=Landsberg%20am%20Lech&output=embed"
              className="h-full w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg md:p-8"
        >
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-5 md:mb-6">
            {t("contact.formTitle")}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("contact.name")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("contact.email")}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("contact.subject")}
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    subject: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("contact.message")}
              </label>
              <textarea
                value={formData.message}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    message: event.target.value,
                  }))
                }
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {statusMessage && (
            <p
              className={`mt-4 text-sm ${
                isError ? "text-red-600" : "text-green-700"
              }`}
            >
              {statusMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full rounded-lg bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 px-4 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("contact.sending") : t("contact.submit")}
          </button>
        </form>
      </div>
    </section>
  );
}
