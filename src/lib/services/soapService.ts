import { config } from "$lib/config/api";

interface SoapResponse {
  xmlDoc: Document;
  success: boolean;
}

async function callSoapService(endpoint: string, action: string, body: string): Promise<SoapResponse> {
  const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:soap="http://soap.p1backend.example.com/">
      <soapenv:Header/>
      <soapenv:Body>
        ${body}
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    const response = await fetch(`${config.apiUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        SOAPAction: action
      },
      body: soapEnvelope
    });

    const responseText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(responseText, "text/xml");
    
    return {
      xmlDoc,
      success: response.ok
    };
  } catch (error) {
    console.error(`Error en llamada SOAP (${action}):`, error);
    throw error;
  }
}

export const userSoapService = {
  callService: (action: string, body: string) => callSoapService('users', action, body)
};

export const appointmentSoapService = {
  callService: (action: string, body: string) => callSoapService('appointments', action, body)
};