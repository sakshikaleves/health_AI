'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [tab, setTab] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  // Load patients (default + shared)
  const loadPatients = async () => {
    try {
      const res = await fetch('/api/proxy/get_patients', { credentials: 'include' });
      const data = await res.json();
      const all = [data.DefaultPatient, ...data.SharedPatients];
      setPatients(all.filter(Boolean));
    } catch (err) {
      setError('Failed to load patients');
    }
  };

  const handleSetPatient = async (id) => {
    await fetch(`/api/proxy/set_patient/${id}`, {
      credentials: 'include',
    });
  };

  useEffect(() => {
    if (tab === 'patients') loadPatients();
    if (tab === 'prescriptions') loadPrescriptions();
  }, [tab]);

  return (
    <div>
      <main style={{ height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {tab === 'patients' && (
          <>
            <h2>Patients</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
              {patients.map(p => (
                <li key={p.id} style={{ marginBottom: '12px' }}>
                  <strong>{p.first_name} {p.last_name}</strong><br />
                  Phone: {p.primary_phone}
                  <br />
                  <button
                    style={{ marginTop: '5px' }}
                    onClick={() => handleSetPatient(p.id)}
                  >
                    View Prescriptions
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}


      </main>
    </div>
  );
}
