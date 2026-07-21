import { describe, it, expect } from 'vitest';
import {
  PREREQ_EDGES,
  validateGraph,
  topoLayers,
  getPrereqs,
  getAllPrereqs,
  getUnmetPrereqsForSkills,
} from './knowledgeGraph';

describe('knowledgeGraph', () => {
  it('mọi cạnh trỏ tới skill tồn tại và không có chu trình', () => {
    expect(validateGraph()).toEqual([]);
  });

  it('có đủ độ phủ (≥60 cạnh, ≥50 skill xuất hiện trong đồ thị)', () => {
    expect(PREREQ_EDGES.length).toBeGreaterThanOrEqual(60);
    const ids = new Set(PREREQ_EDGES.flat());
    expect(ids.size).toBeGreaterThanOrEqual(50);
  });

  it('lớp topo đầu tiên chỉ gồm skill không có prereq', () => {
    const layers = topoLayers();
    expect(layers.length).toBeGreaterThanOrEqual(5);
    for (const id of layers[0]) {
      expect(getPrereqs(id)).toEqual([]);
    }
  });

  it('chuỗi bắc cầu: svd kéo về tận vector_basics', () => {
    const all = getAllPrereqs('svd');
    expect(all).toContain('eigenvalue');
    expect(all).toContain('dot_product');
    expect(all).toContain('vector_basics');
  });

  it('getUnmetPrereqsForSkills bỏ qua skill trong chính nhóm và lọc theo mastery', () => {
    const unmet = getUnmetPrereqsForSkills(
      ['eigenvalue', 'eigenvector'],
      (id) => (id === 'determinant' ? 0.9 : 0),
    );
    expect(unmet).not.toContain('eigenvector'); // thuộc nhóm
    expect(unmet).not.toContain('determinant'); // đã đạt (0.9)
    expect(unmet).toContain('characteristic_polynomial');
    expect(unmet).toContain('matrix_transformation');
  });
});
