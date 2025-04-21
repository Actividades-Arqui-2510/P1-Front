import type { Appointment } from "$lib/types/appointment";

// 📌 Obtener todas las citas
export async function getAllAppointments(): Promise<Appointment[]> {
    const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:app="http://soap.p1backend.example.com/">
       <soapenv:Header/>
       <soapenv:Body>
          <app:getAllAppointments/>
       </soapenv:Body>
    </soapenv:Envelope>
  `;

    const response = await fetch('https://ubiquitous-barnacle-4jjjr69754wp25qxv-8080.app.github.dev/soap/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: soapEnvelope
    });

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const appointmentNodes = Array.from(xmlDoc.getElementsByTagName('appointments'));

    return appointmentNodes.map((el): Appointment => {
        const getText = (tag: string, parent: Element = el) =>
            parent?.getElementsByTagName(tag)?.[0]?.textContent?.trim() ?? '';

        const doctorEl = el.getElementsByTagName('doctor')[0];
        const patientEl = el.getElementsByTagName('patient')[0];

        return {
            appointmentId: Number(getText('appointmentId')),
            appointmentDate: getText('appointmentDate'),
            startTime: getText('startTime'),
            endTime: getText('endTime'),
            status: getText('status'),
            notes: getText('notes'),
            doctor: {
                doctorId: Number(getText('doctorId', doctorEl)),
                firstName: getText('firstName', doctorEl),
                lastName: getText('lastName', doctorEl),
                email: getText('email', doctorEl),
                phone: getText('phone', doctorEl),
                specialty: getText('specialty', doctorEl)
            },
            patient: {
                patientId: Number(getText('patientId', patientEl)),
                firstName: getText('firstName', patientEl),
                lastName: getText('lastName', patientEl),
                email: getText('email', patientEl),
                phone: getText('phone', patientEl),
                dateOfBirth: getText('dateOfBirth', patientEl)
            }
        };
    });
}

// 📌 Obtener detalles por ID
export async function getAppointmentDetails(appointmentId: number | string): Promise<Appointment | null> {
    const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:app="http://soap.p1backend.example.com/">
       <soapenv:Header/>
       <soapenv:Body>
          <app:getAppointmentDetails>
            <appointmentId>${appointmentId}</appointmentId>
          </app:getAppointmentDetails>
       </soapenv:Body>
    </soapenv:Envelope>
  `;

    const response = await fetch('https://ubiquitous-barnacle-4jjjr69754wp25qxv-8080.app.github.dev/soap/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: soapEnvelope
    });

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const el = xmlDoc.getElementsByTagName('appointment')[0];
    if (!el) return null;

    const getText = (tag: string, parent: Element = el) =>
        parent?.getElementsByTagName(tag)?.[0]?.textContent?.trim() ?? '';

    const doctorEl = el.getElementsByTagName('doctor')[0];
    const patientEl = el.getElementsByTagName('patient')[0];

    return {
        appointmentId: Number(getText('appointmentId')),
        appointmentDate: getText('appointmentDate'),
        startTime: getText('startTime'),
        endTime: getText('endTime'),
        status: getText('status'),
        notes: getText('notes'),
        doctor: {
            doctorId: Number(getText('doctorId', doctorEl)),
            firstName: getText('firstName', doctorEl),
            lastName: getText('lastName', doctorEl),
            email: getText('email', doctorEl),
            phone: getText('phone', doctorEl),
            specialty: getText('specialty', doctorEl)
        },
        patient: {
            patientId: Number(getText('patientId', patientEl)),
            firstName: getText('firstName', patientEl),
            lastName: getText('lastName', patientEl),
            email: getText('email', patientEl),
            phone: getText('phone', patientEl),
            dateOfBirth: getText('dateOfBirth', patientEl)
        }
    };
}

// 📌 Crear nueva cita
export async function createAppointment(appointment: Omit<Appointment, 'appointmentId'>): Promise<void> {
    const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:app="http://soap.p1backend.example.com/">
      <soapenv:Header/>
      <soapenv:Body>
        <app:createAppointment>
          <appointmentDetails>
            <appointmentDate>${appointment.appointmentDate}</appointmentDate>
            <startTime>${appointment.startTime}</startTime>
            <endTime>${appointment.endTime}</endTime>
            <status>${appointment.status}</status>
            <notes>${appointment.notes ?? ''}</notes>
            <doctor>
              <doctorId>${appointment.doctor.doctorId}</doctorId>
              <firstName>${appointment.doctor.firstName}</firstName>
              <lastName>${appointment.doctor.lastName}</lastName>
              <email>${appointment.doctor.email}</email>
              <phone>${appointment.doctor.phone}</phone>
              <specialty>${appointment.doctor.specialty}</specialty>
            </doctor>
            <patient>
              <patientId>${appointment.patient.patientId}</patientId>
              <firstName>${appointment.patient.firstName}</firstName>
              <lastName>${appointment.patient.lastName}</lastName>
              <email>${appointment.patient.email}</email>
              <phone>${appointment.patient.phone}</phone>
              <dateOfBirth>${appointment.patient.dateOfBirth}</dateOfBirth>
            </patient>
          </appointmentDetails>
        </app:createAppointment>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

    const response = await fetch('https://ubiquitous-barnacle-4jjjr69754wp25qxv-8080.app.github.dev/soap/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: soapEnvelope
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Error al crear cita: ${err}`);
    }
}

// 📌 Actualizar cita existente
export async function updateAppointment(appointment: Appointment): Promise<void> {
    const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:app="http://soap.p1backend.example.com/">
      <soapenv:Header/>
      <soapenv:Body>
        <app:updateAppointment>
          <appointmentDetails>
            <appointmentId>${appointment.appointmentId}</appointmentId>
            <appointmentDate>${appointment.appointmentDate}</appointmentDate>
            <startTime>${appointment.startTime}</startTime>
            <endTime>${appointment.endTime}</endTime>
            <status>${appointment.status}</status>
            <notes>${appointment.notes ?? ''}</notes>
            <doctor>
              <doctorId>${appointment.doctor.doctorId}</doctorId>
              <firstName>${appointment.doctor.firstName}</firstName>
              <lastName>${appointment.doctor.lastName}</lastName>
              <email>${appointment.doctor.email}</email>
              <phone>${appointment.doctor.phone}</phone>
              <specialty>${appointment.doctor.specialty}</specialty>
            </doctor>
            <patient>
              <patientId>${appointment.patient.patientId}</patientId>
              <firstName>${appointment.patient.firstName}</firstName>
              <lastName>${appointment.patient.lastName}</lastName>
              <email>${appointment.patient.email}</email>
              <phone>${appointment.patient.phone}</phone>
              <dateOfBirth>${appointment.patient.dateOfBirth}</dateOfBirth>
            </patient>
          </appointmentDetails>
        </app:updateAppointment>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

    const response = await fetch('https://ubiquitous-barnacle-4jjjr69754wp25qxv-8080.app.github.dev/soap/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: soapEnvelope
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Error al actualizar cita: ${err}`);
    }
}
export async function deleteAppointment(appointmentId: number | string): Promise<void> {
    const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:app="http://soap.p1backend.example.com/">
        <soapenv:Header/>
        <soapenv:Body>
          <app:deleteAppointment>
            <appointmentId>${appointmentId}</appointmentId>
          </app:deleteAppointment>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const response = await fetch('https://ubiquitous-barnacle-4jjjr69754wp25qxv-8080.app.github.dev/soap/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml',
        },
        body: soapEnvelope
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al eliminar cita: ${text}`);
    }
}