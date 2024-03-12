import React, { useState } from "react";

interface Estado {
  nome: string;
  sigla: string;
  capital: {
    nome: string;
  };
  populacao: number;
  area: number;
  densidadeDemografica: number;
  regiao: {
    nome: string;
  };
  mesorregiao: {
    nome: string;
  };
  microrregiao: {
    nome: string;
  };
}

const App: React.FC = () => {
  const [ufInput, setUfInput] = useState<string>("");
  const [estadoInfo, setEstadoInfo] = useState<Estado | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uf = event.target.value.toUpperCase();
    setUfInput(uf);

    if (uf.length >= 2) {
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}`
        );
        if (!response) {
          throw new Error("Não foi possível obter as informações do estado.");
        }
        const data: Estado = await response.json();
        setEstadoInfo(data);
        setErro(null);
      } catch (error) {
        console.error("Erro ao buscar informações do estado:", error);
        setEstadoInfo(null);
        setErro(
          "Estado não encontrado. Por favor, verifique a sigla digitada."
        );
      }
    } else {
      setEstadoInfo(null);
      setErro(null);
    }
  };

  return (
    <main className="main-container">
      <h1>Procurando por estados brasileiros?</h1>
      <p>
        Digite a sigla do estado (UF) no campo abaixo para ver suas informações.
      </p>

      <input
        className="input-search"
        type="text"
        id="estado-pesquisa"
        placeholder="Digite a sigla do estado (UF)"
        value={ufInput}
        onChange={handleInputChange}
        maxLength={2}
        autoComplete="off"
      />

      {estadoInfo && Object.keys(estadoInfo).length === 0 && (
        <p className="error-message">
          Estado não encontrado. Por favor, verifique a sigla digitada.
        </p>
      )}

      {estadoInfo && Object.keys(estadoInfo).length > 0 && (
        <section className="information-container" id="estado-informacoes">
          <ul className="information-section">
            <h3>
              <strong>{estadoInfo.nome}</strong>
            </h3>
            <li>
              <strong>Estado:</strong> {estadoInfo.nome}
            </li>
            <li>
              <strong>Sigla:</strong> {estadoInfo.sigla}
            </li>
            <li>
              <strong>Região:</strong> {estadoInfo.regiao?.nome}
            </li>
          </ul>
        </section>
      )}

      {erro && <p>{erro}</p>}
    </main>
  );
};

export default App;
