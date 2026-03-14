import React, { createContext, useContext, useState, useCallback } from 'react';
import { SUPPLEMENTS, INTERACTIONS } from '../data/supplements';
const StackContext = createContext(null);
export function StackProvider({ children }) {
  const [stack, setStack] = useState([]);
  const addItem = useCallback((id) => {
    const supp = SUPPLEMENTS.find(s => s.id === id);
    if (!supp || stack.find(s => s.id === id)) return;
    setStack(prev => [...prev, { ...supp, dose: supp.defaultDose }]);
  }, [stack]);
  const removeItem = useCallback((id) => setStack(prev => prev.filter(s => s.id !== id)), []);
  const updateDose = useCallback((id, dose) => {
    setStack(prev => prev.map(s => s.id === id ? { ...s, dose: parseFloat(dose) || 0 } : s));
  }, []);
  const getInteractions = useCallback(() => {
    const found = [];
    for (let i = 0; i < stack.length; i++) {
      for (let j = i + 1; j < stack.length; j++) {
        const key = [stack[i].id, stack[j].id].sort().join('+');
        if (INTERACTIONS[key]) {
          found.push({ key, a: stack[i], b: stack[j], ...INTERACTIONS[key] });
        } else {
          const cross = (stack[i].interactions||[]).includes(stack[j].id) || (stack[j].interactions||[]).includes(stack[i].id);
          if (cross) found.push({ key, a: stack[i], b: stack[j], sev: 'warn', title: 'Potential interaction', text: stack[i].name + ' and ' + stack[j].name + ' share interaction pathways. Review combined use carefully.' });
        }
      }
    }
    return found;
  }, [stack]);
  const getULFlags = useCallback(() => stack.filter(s => s.ul && s.dose > s.ul), [stack]);
  const getNutrientTotals = useCallback(() => {
    const totals = {};
    stack.forEach(s => { if (s.nutrients) Object.entries(s.nutrients).forEach(([k,v]) => { totals[k] = (totals[k]||0) + ((v/s.defaultDose)*s.dose); }); });
    return totals;
  }, [stack]);
  const getSummary = useCallback(() => {
    const interactions = getInteractions();
    const ulFlags = getULFlags();
    return { total: stack.length, overlaps: interactions.length, risks: interactions.filter(x=>x.sev==='danger').length + ulFlags.length };
  }, [stack, getInteractions, getULFlags]);
  return (
    <StackContext.Provider value={{ stack, addItem, removeItem, updateDose, getInteractions, getULFlags, getNutrientTotals, getSummary }}>
      {children}
    </StackContext.Provider>
  );
}
export const useStack = () => useContext(StackContext);