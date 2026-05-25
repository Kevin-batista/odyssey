import { ExternalLink } from "lucide-react"

function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "Info",
      links: [
        { label: "Odyssey Marketplace", pageId: "marketplace", isExternal: true },
        { label: "Refund Policy", pageId: "refund", isExternal: true }, 
        { label: "Shipping Policy", pageId: "shipping", isExternal: true },
        { label: "Purchase Agreement", pageId: "purchase", isExternal: true },
        { label: "Terms of Use", pageId: "terms", isExternal: true },   
        { label: "Privacy Policy", pageId: "privacy", isExternal: true }, 
        { label: "Your Privacy Choices", pageId: "choices", isExternal: true },
        { label: "Cookie Preferences", pageId: "cookies", isExternal: false },
      ],
    },
    {
      title: "Odyssey",
      links: [
        { label: "About", pageId: "about", isExternal: true },
        { label: "Careers", pageId: "careers", isExternal: true },
        { label: "Advertise", pageId: "advertise", isExternal: true },
        { label: "Products", pageId: "products", isExternal: true },
        { label: "Contact Us", pageId: "contact", isExternal: true },
        { label: "Feedback", pageId: "feedback", isExternal: true },
        { label: "Help", pageId: "help", isExternal: true },
      ],
    },
    {
      title: "Browse By",
      links: [
        { label: "Cities", pageId: "cities", isExternal: false },
        { label: "Venues", pageId: "venues", isExternal: false },
      ],
    },
  ]

  // ⚡ Hard navigation handler to force the browser out of the React lifecycle
  const handleNavigation = (e, pageId, isExternal) => {
    const targetUrl = `/footer-details.html?page=${pageId}`;
    
    if (isExternal) {
      // If it opens in a new tab, let the default target="_blank" handle it natively
      return;
    }

    // For _self links, block any SPA router hijacking and force an absolute browser load
    e.preventDefault();
    window.location.href = targetUrl;
  };

  return (
    <footer className="w-full bg-[#070a1e] border-t border-white/5 mt-auto text-gray-400 text-xs relative z-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* GRID LINK COLUMNS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={`/footer-details.html?page=${link.pageId}`}
                      target={link.isExternal ? "_blank" : "_self"} 
                      rel={link.isExternal ? "noopener noreferrer" : ""}
                      onClick={(e) => handleNavigation(e, link.pageId, link.isExternal)}
                      className="hover:text-white transition-colors duration-150 inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      {link.isExternal && (
                        <ExternalLink 
                          size={10} 
                          className="opacity-40 group-hover:opacity-100 transition-opacity" 
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM METRICS & COPYRIGHT BAR */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-500">
          <p>© {currentYear} Odyssey. All rights reserved.</p>
          <div className="flex gap-4">
            <a 
              href="/footer-details.html?page=marketplace" 
              onClick={(e) => handleNavigation(e, "marketplace", false)}
              className="hover:underline"
            >
              Global Site
            </a>
            <a 
              href="/footer-details.html?page=help" 
              onClick={(e) => handleNavigation(e, "help", false)}
              className="hover:underline"
            >
              Accessibility
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer