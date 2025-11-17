# Project Roadmap

This document outlines the potential future direction for the Shahar's Carpentry Quote Generator.

---

## Short-Term Goals (Next 1-3 Months)

*   **UI/UX Polish**:
    *   Enhance form validation with real-time feedback.
    *   Add subtle animations and transitions to improve the user experience.
*   **Configuration Page**:
    *   Create a settings page where the business owner can edit the cost constants (e.g., `TRAVEL_COST_PER_KM`, `WOOD_PRICE_PER_METER`, `DEFAULT_PROFIT_MARGIN`) directly from the UI. This removes the need to change them in the code.
*   **Save/Load Quotes**:
    *   Implement local storage to save in-progress or completed quotes. This allows the user to close the browser and resume later without losing data.

---

## Mid-Term Goals (Next 3-9 Months)

*   **Database Integration**:
    *   Move from local storage to a simple backend/database solution (e.g., Firebase Firestore) to store quotes and client information centrally. This would allow access from multiple devices.
*   **Simple Client Management**:
    *   Add a "Clients" page to view a list of all clients for whom quotes have been generated.
    *   Allow editing client details and viewing their quote history.
*   **Quote Templating**:
    *   Allow basic customization of the PDF and email templates from the settings page (e.g., adding a custom footer note).

---

## Long-Term Vision (1+ Year)

*   **Analytics Dashboard**:
    *   Provide a simple dashboard with insights on profitability, most quoted workshops, and quote conversion rates (if tracking is added).
*   **Full Bilingual Support**:
    *   Investigate more robust, server-side solutions for PDF generation that can reliably handle Hebrew and other RTL languages, allowing for fully bilingual document outputs.
*   **Integration with Accounting Software**:
    *   Explore APIs to export quote data to popular accounting tools to streamline invoicing.