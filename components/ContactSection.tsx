import { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Phone, MapPin } from "lucide-react";

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
        icon: Phone,
      },
      {
        label: t("contact.labels.phone"),
        value: "+387 51 462 241",
        icon: Phone,
      },
      {
        label: t("contact.labels.address"),
        value: "Landsberg am Lech, Germany",
        icon: MapPin,
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
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 md:mb-6">
            {t("contact.title")}
          </h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-base md:text-lg">
            {t("contact.description")}
          </p>

          <div className="space-y-4 mb-6 md:mb-8 rounded-lg border border-border bg-card p-5 shadow-sm">
            {contacts.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <Icon
                    className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg">
                      {contact.label}
                    </h3>
                    {contact.label === t("contact.labels.phone") ? (
                      <a
                        href={`tel:${contact.value.replace(/\s+/g, "")}`}
                        className="text-muted-foreground mt-1 block hover:underline"
                      >
                        {contact.value}
                      </a>
                    ) : (
                      <p className="text-muted-foreground mt-1">
                        {contact.value}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg overflow-hidden shadow-sm border border-border h-72 md:h-96">
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
          className="rounded-lg border border-border bg-card p-6 shadow-sm"
        >
          <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-5 md:mb-6">
            {t("contact.formTitle")}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
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
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
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
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
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
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
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
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
              />
            </div>
          </div>

          {statusMessage && (
            <p
              className={`mt-4 text-sm ${
                isError ? "text-red-600" : "text-emerald-700"
              }`}
            >
              {statusMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full rounded-lg bg-emerald-700 px-4 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t("contact.sending") : t("contact.submit")}
          </button>
        </form>
      </div>
    </section>
  );
}
