import { useEffect, useState } from "react";

// Executa uma função assíncrona e devolve { data, loading, error }.
export function useApi(funcao, dependencias = []) {
  const [estado, setEstado] = useState({ data: null, loading: true, error: "" });

  useEffect(() => {
    let cancelado = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado({ data: null, loading: true, error: "" });

    funcao()
      .then((data) => {
        if (!cancelado) setEstado({ data, loading: false, error: "" });
      })
      .catch((erro) => {
        if (!cancelado) {
          setEstado({ data: null, loading: false, error: erro.message });
        }
      });

    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  return estado;
}
