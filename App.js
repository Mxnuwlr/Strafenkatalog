import { useState, useEffect } from "react";

export default function App() {
  const [personen, setPersonen] = useState(() => {
    const gespeicherte = localStorage.getItem("personen");
    return gespeicherte ? JSON.parse(gespeicherte) : [];
  });

  const [name, setName] = useState("");
  const [betrag, setBetrag] = useState("");
  const [admin, setAdmin] = useState(() => {
    return localStorage.getItem("admin") === "true";
  });
  const [adminPass, setAdminPass] = useState("");

  useEffect(() => {
    localStorage.setItem("personen", JSON.stringify(personen));
  }, [personen]);

  const strafeHinzufuegen = () => {
    if (!name || !betrag) return;
    setPersonen(prev => {
      const existierend = prev.find(p => p.name === name);
      if (existierend) {
        return prev.map(p =>
          p.name === name ? { ...p, offen: p.offen + parseFloat(betrag) } : p
        );
      } else {
        return [...prev, { name, offen: parseFloat(betrag), bezahlt: 0 }];
      }
    });
    setName("");
    setBetrag("");
  };

  const bezahlungEintragen = (personName, betrag) => {
    setPersonen(prev =>
      prev.map(p =>
        p.name === personName
          ? {
              ...p,
              bezahlt: p.bezahlt + parseFloat(betrag),
              offen: p.offen - parseFloat(betrag),
            }
          : p
      )
    );
  };

  const gesamtPott = personen.reduce((sum, p) => sum + p.bezahlt, 0);
  const groessterSuender = personen.reduce((max, p) => (p.offen > max.offen ? p : max), { offen: -1 });

  const handleLogin = () => {
    if (adminPass === "geheim") {
      setAdmin(true);
      localStorage.setItem("admin", "true");
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>
        💸 Gruppen-Strafenkasse
      </h1>

      {!admin ? (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input
            type="password"
            placeholder="Admin Passwort"
            value={adminPass}
            onChange={e => setAdminPass(e.target.value)}
          />
          <button onClick={handleLogin}>🔐 Admin Login</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Betrag €"
            value={betrag}
            onChange={e => setBetrag(e.target.value)}
          />
          <button onClick={strafeHinzufuegen}>+ Strafe</button>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        {personen.map(p => (
          <div key={p.name} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>👤 {p.name}</div>
            <div>Bezahlt: {p.bezahlt.toFixed(2)} €</div>
            <div>Offen: {p.offen.toFixed(2)} €</div>
            {admin && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Betrag €"
                  onChange={e => p.zahlung = e.target.value}
                />
                <button onClick={() => bezahlungEintragen(p.name, p.zahlung || 0)}>
                  ✅ Bezahlt
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', marginTop: '2rem' }}>
        🏦 Gesamt im Pott: {gesamtPott.toFixed(2)} €
      </div>

      {groessterSuender.name && (
        <div style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', marginTop: '1rem' }}>
          👑 Größter Sünder: {groessterSuender.name} mit {groessterSuender.offen.toFixed(2)} € offen
        </div>
      )}
    </div>
  );
}
