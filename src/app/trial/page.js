"use client"
import React, { useEffect } from 'react'

function page() {
    useEffect(() => {
      const fetchPrescription = async () => {
        try {
          const res = await fetch("/api/proxy/prescription");
          const data = await res.json(); // or res.text() if it's not JSON
          console.log(data);
        } catch (error) {
          console.error("Frontend Error:", error);
        }
      };

      fetchPrescription();
    }, []);
    
  return (
    <div className='mt-24'>
      hello
    </div>
  )
}

export default page
