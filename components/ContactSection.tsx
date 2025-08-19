export default function ContactSection() {
  const contacts = [
    { label: "Telefon", value: "+387 51 211 840", icon: "📞" },
    { label: "Telefon", value: "+387 51 462 241", icon: "📞" },
    // { label: "Email", value: "info@medzlis-bl.ba", icon: "✉️" },
    {
      label: "Adresa",
      value: "Kralja Petra I Karađorđevića, Banja Luka",
      icon: "📍",
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">Kontaktirajte nas</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Imate pitanja ili želite saznati više o našim aktivnostima? Javite
            nam se!
          </p>
          <div className="space-y-6">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4 text-xl">
                  {contact.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{contact.label}</h3>
                  {contact.label === "Telefon" ? (
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
        </div>
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3574.013574009538!2d17.1872272!3d44.767456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475e0318a3a01765%3A0x52529e0dcfb0278f!2sD%C5%BEamija%20Ferhadija!5e1!3m2!1shr!2sba!4v1755167738426!5m2!1shr!2sba"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
