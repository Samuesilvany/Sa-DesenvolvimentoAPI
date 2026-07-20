import { useEffect, useMemo, useState } from 'react';
import './equipamentos.css';

const API_BASE = 'http://localhost:3000';

const initialForm = {
  numero_serie: '',
  modelo: '',
  status: 'Ativo',
  categoria_id: '',
  setor_id: '',
};

function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

export default function EquipamentosPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const formPayload = useMemo(() => {
    
    return {
      numero_serie: form.numero_serie,
      modelo: form.modelo,
      status: form.status,
      categoria_id: toNumberOrNull(form.categoria_id),
      setor_id: toNumberOrNull(form.setor_id),
    };
  }, [form]);

  async function fetchAll() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/equipamentos`);
      if (!res.ok) {
        throw new Error(`Falha ao listar: ${res.status}`);
      }
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    
  }, []);

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      numero_serie: item.numero_serie ?? '',
      modelo: item.modelo ?? '',
      status: item.status ?? '',
      categoria_id: item.categoria_id ?? '',
      setor_id: item.setor_id ?? '',
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = formPayload;

    try {
      if (editingId) {
        const res = await fetch(`${API_BASE}/equipamentos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => '');
          throw new Error(`Falha ao atualizar: ${res.status} ${msg}`);
        }
      } else {
        const res = await fetch(`${API_BASE}/equipamentos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => '');
          throw new Error(`Falha ao criar: ${res.status} ${msg}`);
        }
      }

      resetForm();
      await fetchAll();
      setSuccess(editingId ? 'Equipamento atualizado com sucesso!' : 'Equipamento criado com sucesso!');
    } catch (e2) {
      setError(String(e2?.message ?? e2));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remover este equipamento?')) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/equipamentos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(`Falha ao remover: ${res.status} ${msg}`);
      }
      await fetchAll();
      setSuccess('Equipamento removido com sucesso!');
      if (editingId === id) resetForm();
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(''), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  return (
    <div className="eq-wrap">
      <h1>Equipamentos</h1>

      {success ? <div className="eq-success">{success}</div> : null}
      {error ? <div className="eq-error">{error}</div> : null}

      <div className="eq-grid">
        <div className="eq-form-card">
          <h2>{editingId ? 'Editar equipamento' : 'Criar equipamento'}</h2>

          <form onSubmit={handleSubmit} className="eq-form">
            <label>
              Número de série
              <input
                value={form.numero_serie}
                onChange={(e) => setForm((s) => ({ ...s, numero_serie: e.target.value }))}
                required
              />
            </label>

            <label>
              Modelo
              <input
                value={form.modelo}
                onChange={(e) => setForm((s) => ({ ...s, modelo: e.target.value }))}
                required
              />
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
              >
                <option value="Ativo">Ativo</option>
                <option value="Em Estoque">Em Estoque</option>
              </select>
            </label>

            <label>
              Categoria ID
              <input
                type="number"
                value={form.categoria_id}
                onChange={(e) => setForm((s) => ({ ...s, categoria_id: e.target.value }))}
                required
              />
            </label>

            <label>
              Setor ID
              <input
                type="number"
                value={form.setor_id}
                onChange={(e) => setForm((s) => ({ ...s, setor_id: e.target.value }))}
                required
              />
            </label>

            <div className="eq-actions">
              <button type="submit" disabled={loading}>
                {editingId ? 'Salvar' : 'Criar'}
              </button>
              {editingId ? (
                <button type="button" className="secondary" onClick={resetForm} disabled={loading}>
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="eq-list-card">
          <div className="eq-list-header">
            <h2>Lista</h2>
            <button type="button" className="secondary" onClick={fetchAll} disabled={loading}>
              Atualizar
            </button>
          </div>

          {loading ? <div className="eq-loading">Carregando...</div> : null}

          {!loading ? (
            <table className="eq-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Número de série</th>
                  <th>Modelo</th>
                  <th>Status</th>
                  <th>Categoria</th>
                  <th>Setor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>{it.numero_serie}</td>
                    <td>{it.modelo}</td>
                    <td>{it.status}</td>
                    <td>{it.categoria_id}</td>
                    <td>{it.setor_id}</td>
                    <td>
                      <button type="button" onClick={() => startEdit(it)} disabled={loading}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => handleDelete(it.id)}
                        disabled={loading}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="eq-empty">
                      Nenhum equipamento encontrado.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </div>
  );
}

