declare global {
  interface Window {
    google?: any;
  }
}

export async function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
}

export async function promptGoogleIdToken(clientId: string): Promise<string> {
  await loadGoogleScript();
  return new Promise<string>((resolve, reject) => {
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => {
          const idToken = response?.credential;
          if (!idToken) return reject(new Error("No credential from Google"));
          resolve(idToken);
        },
        ux_mode: "popup",
      });
      window.google.accounts.id.prompt();
    } catch (e) {
      reject(e);
    }
  });
}


