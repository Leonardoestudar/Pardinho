import React, { useState } from 'react';
import { Archive, Edit, Plus, Save, X, AlertCircle, Menu } from 'lucide-react';

interface Item {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
  categoria: string;
  sugeridoPor: string;
}

const CATEGORIAS = [
  'Bebidas',
  'Comidas',
  'Café da Manhã',
  'Lanches',
  'Frutas e Verduras',
  'Carnes',
  'Higiene',
  'Limpeza',
  'Outros'
];

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [archivedItems, setArchivedItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
    nome: '',
    quantidade: 1,
    preco: 0,
    categoria: '',
    sugeridoPor: ''
  });

  const showAlert = (message: string) => {
    setAlert(message);
    setTimeout(() => setAlert(null), 3000);
  };

  const addItem = () => {
    if (!newItem.nome || newItem.preco <= 0) {
      showAlert('Por favor, preencha o nome e o preço do item.');
      return;
    }

    const itemExists = items.some(
      item => item.nome.toLowerCase() === newItem.nome.toLowerCase()
    );

    if (itemExists) {
      showAlert('Este item já existe na lista!');
      return;
    }

    setItems([...items, { ...newItem, id: Date.now() }]);
    setNewItem({
      nome: '',
      quantidade: 1,
      preco: 0,
      categoria: '',
      sugeridoPor: ''
    });
  };

  const archiveItem = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setArchivedItems([...archivedItems, item]);
      setItems(items.filter(i => i.id !== id));
    }
  };

  const startEditing = (item: Item) => {
    setEditingItem(item);
  };

  const saveEdit = () => {
    if (editingItem) {
      const itemExists = items.some(
        item => item.id !== editingItem.id && 
        item.nome.toLowerCase() === editingItem.nome.toLowerCase()
      );

      if (itemExists) {
        showAlert('Já existe outro item com este nome!');
        return;
      }

      setItems(items.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const renderItemCard = (item: Item, isArchived = false) => (
    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{item.nome}</h3>
        {!isArchived && (
          <div className="flex gap-2">
            <button
              onClick={() => startEditing(item)}
              className="text-blue-600 hover:text-blue-900"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => archiveItem(item.id)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Archive size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-1 text-sm">
        <p>Quantidade: {item.quantidade}</p>
        <p>Preço: R$ {item.preco.toFixed(2)}</p>
        <p>Total: R$ {(item.quantidade * item.preco).toFixed(2)}</p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {item.categoria || 'Sem categoria'}
          </span>
        </div>
        <p className="text-gray-500">Sugerido por: {item.sugeridoPor}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Lista de Compras</h1>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
          >
            {showArchived ? 'Ver Lista Atual' : 'Ver Arquivados'}
          </button>
        </div>
        
        {alert && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {alert}
          </div>
        )}
        
        {!showArchived && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <input
                  type="text"
                  placeholder="Nome do item"
                  className="w-full border rounded p-2"
                  value={newItem.nome}
                  onChange={e => setNewItem({ ...newItem, nome: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border rounded p-2"
                    value={newItem.quantidade}
                    onChange={e => setNewItem({ ...newItem, quantidade: Math.max(1, Number(e.target.value)) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border rounded p-2"
                    value={newItem.preco}
                    onChange={e => setNewItem({ ...newItem, preco: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  className="w-full border rounded p-2"
                  value={newItem.categoria}
                  onChange={e => setNewItem({ ...newItem, categoria: e.target.value })}
                >
                  <option value="">Selecione uma categoria</option>
                  {CATEGORIAS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sugerido por</label>
                <input
                  type="text"
                  placeholder="Nome"
                  className="w-full border rounded p-2"
                  value={newItem.sugeridoPor}
                  onChange={e => setNewItem({ ...newItem, sugeridoPor: e.target.value })}
                />
              </div>
              <button
                onClick={addItem}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Adicionar Item
              </button>
            </div>
          </div>
        )}

        {!showArchived ? (
          <>
            <div className="space-y-4">
              {items.map(item => 
                editingItem?.id === item.id ? (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="space-y-4">
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={editingItem.nome}
                        onChange={e => setEditingItem({ ...editingItem, nome: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          min="1"
                          className="border rounded p-2"
                          value={editingItem.quantidade}
                          onChange={e => setEditingItem({ ...editingItem, quantidade: Math.max(1, Number(e.target.value)) })}
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="border rounded p-2"
                          value={editingItem.preco}
                          onChange={e => setEditingItem({ ...editingItem, preco: Number(e.target.value) })}
                        />
                      </div>
                      <select
                        className="w-full border rounded p-2"
                        value={editingItem.categoria}
                        onChange={e => setEditingItem({ ...editingItem, categoria: e.target.value })}
                      >
                        <option value="">Selecione uma categoria</option>
                        {CATEGORIAS.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={editingItem.sugeridoPor}
                        onChange={e => setEditingItem({ ...editingItem, sugeridoPor: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
                        >
                          <Save size={20} /> Salvar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2"
                        >
                          <X size={20} /> Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : renderItemCard(item)
              )}
            </div>
            
            {items.length > 0 && (
              <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">
                  Total Estimado: R$ {calculateTotal().toFixed(2)}
                </h2>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Items Arquivados</h2>
            {archivedItems.map(item => renderItemCard(item, true))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;