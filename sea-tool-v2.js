const STORAGE_KEY = 'offshore-fishing-region-system-v4';
const DEFAULT_SCENE = { width: 1600, height: 900, url: './assets/offshore-chart-fallback.svg' };
const RULE_DOMAINS = [
  { id: 'AccessRule', label: 'AccessRule', tagField: 'AccessTag', profileField: 'AccessProfileId', auraKey: 'Access', summaryKey: 'Navigation' },
  { id: 'FishingInteractionRule', label: 'FishingInteractionRule', tagField: 'FishingInteractionTag', profileField: 'FishingInteractionProfileId', auraKey: 'Fishing', summaryKey: 'Fishing' },
  { id: 'NavigationInteractionRule', label: 'NavigationInteractionRule', tagField: 'NavigationInteractionTag', profileField: 'NavigationInteractionProfileId', auraKey: 'Navigation', summaryKey: 'Navigation' },
  { id: 'FishSpawnRule', label: 'FishSpawnRule', tagField: 'FishSpawnTag', profileField: 'FishSpawnProfileId', auraKey: 'FishSpawn', summaryKey: 'FishSpawn' },
  { id: 'EnvironmentRule', label: 'EnvironmentRule', tagField: 'EnvironmentTag', profileField: 'EnvironmentProfileId', auraKey: 'Environment', summaryKey: 'Environment' },
];
const DEFAULT_OPTIONS = {
  Tags: ['近海', '外海', '深海', '礁石', '沉船', '灯塔', '港口', '危险', '稀有', '任务'],
  RegionCategory: ['BaseSeaArea', 'PoiInfluenceArea', 'EventArea'],
};
const DEMO_CONFIG = {
  tagEnums: {
    EnvironmentTag: ['NearshoreCalm', 'OpenSeaCold', 'DeepSeaPressure', 'StormEvent'],
    AccessTag: ['PublicRoute', 'RestrictedWaters', 'EventLockdown'],
    FishingInteractionTag: ['CoastalCast', 'ReefFishing', 'EventFishingBoost'],
    NavigationInteractionTag: ['SafeNavigation', 'RockHazard', 'NoAnchoring'],
    FishSpawnTag: ['CoastalSchool', 'ReefHabitat', 'EventRareSpawn'],
  },
  priorities: {
    EnvironmentTag: { StormEvent: 100, DeepSeaPressure: 80, OpenSeaCold: 60, NearshoreCalm: 40 },
    AccessTag: { EventLockdown: 100, RestrictedWaters: 80, PublicRoute: 40 },
    FishingInteractionTag: { EventFishingBoost: 100, ReefFishing: 80, CoastalCast: 40 },
    NavigationInteractionTag: { NoAnchoring: 100, RockHazard: 80, SafeNavigation: 40 },
    FishSpawnTag: { EventRareSpawn: 100, ReefHabitat: 80, CoastalSchool: 40 },
  },
};
const DEFAULT_RULE_PROFILES = {
  AccessProfile: {},
  FishingInteractionProfile: {},
  NavigationInteractionProfile: {},
  FishSpawnProfile: {},
  EnvironmentProfile: {},
};
const CATEGORY_COLORS = { BaseSeaArea: '#3b82f6', PoiInfluenceArea: '#22c55e', EventArea: '#ef4444' };
const FILTER_BOOLEAN_OPTIONS = ['Enabled', 'Disabled'];
const DEFAULT_SCHEMA = {
  sections: [
    {
      id: 'basic', title: '基础属性', fields: [
        { key: 'RegionId', label: 'RegionId', type: 'text' },
        { key: 'Name', label: 'Name', type: 'text' },
        { key: 'RegionCategory', label: 'RegionCategory', type: 'select', source: 'RegionCategory' },
        { key: 'Tags', label: 'Tags', type: 'multiselect', source: 'Tags' },
        { key: 'Enabled', label: 'Enabled', type: 'boolean' },
        { key: 'EnvironmentTag', label: 'EnvironmentTag', type: 'select', source: 'EnvironmentTag' },
        { key: 'AccessTag', label: 'AccessTag', type: 'select', source: 'AccessTag' },
        { key: 'FishingInteractionTag', label: 'FishingInteractionTag', type: 'select', source: 'FishingInteractionTag' },
        { key: 'NavigationInteractionTag', label: 'NavigationInteractionTag', type: 'select', source: 'NavigationInteractionTag' },
        { key: 'FishSpawnTag', label: 'FishSpawnTag', type: 'select', source: 'FishSpawnTag' },
      ]
    },
    { id: 'spatial', title: '空间范围', fields: [{ key: 'GeometryIds', label: 'GeometryIds', type: 'list' }] },
    {
      id: 'interaction', title: '交互规则', fields: [
        { key: 'AccessProfileId', label: 'AccessProfileId', type: 'text' },
        { key: 'FishingInteractionProfileId', label: 'FishingInteractionProfileId', type: 'text' },
        { key: 'NavigationInteractionProfileId', label: 'NavigationInteractionProfileId', type: 'text' },
        { key: 'EnvironmentProfileId', label: 'EnvironmentProfileId', type: 'text' },
      ]
    },
    { id: 'output', title: '产出内容', fields: [{ key: 'FishSpawnProfileId', label: 'FishSpawnProfileId', type: 'text' }] },
    {
      id: 'support', title: '辅助', fields: [
        { key: 'SortOrder', label: 'SortOrder', type: 'number' },
        { key: 'Description', label: 'Description', type: 'textarea' },
      ]
    }
  ]
};
const SAMPLE_REGIONS = [
  {
    RegionId: 'sea-base-001', Name: '北部深海基底区', RegionCategory: 'BaseSeaArea', Tags: ['深海', '外海'], Enabled: true,
    GeometryIds: ['geom-sea-base-001'], EnvironmentTag: 'DeepSeaPressure', AccessTag: 'PublicRoute', FishingInteractionTag: 'CoastalCast', NavigationInteractionTag: 'SafeNavigation', FishSpawnTag: 'CoastalSchool',
    AccessProfileId: 'access-public-lane', FishingInteractionProfileId: 'fish-standard-cast', NavigationInteractionProfileId: 'nav-safe-passage', EnvironmentProfileId: 'env-deep-pressure', FishSpawnProfileId: 'spawn-open-ocean',
    SortOrder: 10, Description: '基础深海区域，提供默认环境压力与开放通行基线。',
    AuraSummary: { Environment: ['WaveSpeed +2', 'Visibility x0.7'], Fishing: ['WaitTime x1.0'], Navigation: ['可正常通航'], FishSpawn: ['基础外海鱼群'] },
    Geometry: { Type: 'Polygon', Points: [[180, 140], [1360, 120], [1460, 740], [220, 800]], Center: [], Radius: 0 }
  },
  {
    RegionId: 'sea-poi-reef-001', Name: '西礁群影响区', RegionCategory: 'PoiInfluenceArea', Tags: ['近海', '礁石', '危险'], Enabled: true,
    GeometryIds: ['geom-sea-poi-reef-001'], EnvironmentTag: 'NearshoreCalm', AccessTag: 'RestrictedWaters', FishingInteractionTag: 'ReefFishing', NavigationInteractionTag: 'RockHazard', FishSpawnTag: 'ReefHabitat',
    AccessProfileId: 'access-reef-restricted', FishingInteractionProfileId: 'fish-reef-bonus', NavigationInteractionProfileId: 'nav-rock-hazard', EnvironmentProfileId: 'env-reef-current', FishSpawnProfileId: 'spawn-reef-cluster',
    SortOrder: 20, Description: '礁石周边区域，强调危险航行与优质礁群鱼点。',
    AuraSummary: { Environment: ['CurrentNoise +1'], Fishing: ['WaitTime x0.8', 'HookRate +15%'], Navigation: ['转向容错降低'], FishSpawn: ['礁群鱼池'] },
    Geometry: { Type: 'Polygon', Points: [[430, 260], [760, 240], [780, 520], [470, 560]], Center: [], Radius: 0 }
  },
  {
    RegionId: 'sea-event-001', Name: '灯塔活动事件圈', RegionCategory: 'EventArea', Tags: ['灯塔', '任务', '稀有'], Enabled: true,
    GeometryIds: ['geom-sea-event-001'], EnvironmentTag: 'StormEvent', AccessTag: 'EventLockdown', FishingInteractionTag: 'EventFishingBoost', NavigationInteractionTag: 'NoAnchoring', FishSpawnTag: 'EventRareSpawn',
    AccessProfileId: 'access-event-lockdown', FishingInteractionProfileId: 'fish-event-boost', NavigationInteractionProfileId: 'nav-no-anchoring', EnvironmentProfileId: 'env-event-storm', FishSpawnProfileId: 'spawn-rare-event',
    SortOrder: 30, Description: '围绕灯塔生成的限时事件圈，用来演示高优先级事件对多个规则域的接管。',
    AuraSummary: { Environment: ['StormIntensity +3', 'Visibility x0.5'], Fishing: ['RareChance +40%'], Navigation: ['禁止停船'], FishSpawn: ['活动鱼池'] },
    Geometry: { Type: 'Circle', Points: [], Center: [700, 420], Radius: 170 }
  },
  {
    RegionId: 'sea-access-001', Name: '外侧航道保护带', RegionCategory: 'PoiInfluenceArea', Tags: ['港口', '任务'], Enabled: true,
    GeometryIds: ['geom-sea-access-001'], EnvironmentTag: 'OpenSeaCold', AccessTag: 'RestrictedWaters', FishingInteractionTag: 'CoastalCast', NavigationInteractionTag: 'SafeNavigation', FishSpawnTag: 'CoastalSchool',
    AccessProfileId: 'access-controlled-lane', FishingInteractionProfileId: 'fish-standard-cast', NavigationInteractionProfileId: 'nav-guided-lane', EnvironmentProfileId: 'env-cold-open-sea', FishSpawnProfileId: 'spawn-lane-school',
    SortOrder: 40, Description: '和事件区、礁石区重叠的航道带，用来展示 Access 与 Navigation 规则可由不同区域主导。',
    AuraSummary: { Environment: ['ColdWater +1'], Fishing: ['WaitTime x1.1'], Navigation: ['航道引导'], FishSpawn: ['常规航道鱼群'] },
    Geometry: { Type: 'Rectangle', Points: [[620, 220], [1080, 620]], Center: [], Radius: 0 }
  }
];
const state = { scene: { ...DEFAULT_SCENE }, options: clone(DEFAULT_OPTIONS), schema: clone(DEFAULT_SCHEMA), demoConfig: clone(DEMO_CONFIG), ruleProfiles: clone(DEFAULT_RULE_PROFILES), regions: [], sketchLayers: [], selectedId: null, selectedLayerKey: null, showUnmatched: true, layers: new Map(), viewMode: 'region', analysisEnabled: true, analysis: null, filters: { tags: new Set(), categories: new Set(), enabled: new Set(), environment: new Set(), access: new Set(), fishing: new Set(), navigation: new Set(), spawn: new Set() }, brush: { enabled: false, drawing: false, radius: 28, points: [], preview: null }, sketch: { enabled: false, drawing: false, width: 3, points: [], preview: null }, rulePopup: null };
const els = { mapUpload: document.querySelector('#map-upload'), configUpload: document.querySelector('#config-upload'), exportConfig: document.querySelector('#export-config'), clearStorage: document.querySelector('#clear-storage'), optionsTags: document.querySelector('#options-tags'), optionsCategories: document.querySelector('#options-categories'), demoConfig: document.querySelector('#demo-config'), schemaConfig: document.querySelector('#schema-config'), applyOptions: document.querySelector('#apply-options'), loadSample: document.querySelector('#load-sample'), ruleBindingList: document.querySelector('#rule-binding-list'), priorityBoard: document.querySelector('#priority-board'), tagFilter: document.querySelector('#tag-filter-select'), categoryFilter: document.querySelector('#category-filter-select'), enabledFilter: document.querySelector('#enabled-filter-select'), environmentFilter: document.querySelector('#environment-filter-select'), accessFilter: document.querySelector('#access-filter-select'), fishingFilter: document.querySelector('#fishing-filter-select'), navigationFilter: document.querySelector('#navigation-filter-select'), spawnFilter: document.querySelector('#spawn-filter-select'), resetFilters: document.querySelector('#reset-filters'), toggleUnmatched: document.querySelector('#toggle-unmatched'), layerPanel: document.querySelector('#layer-panel'), regionList: document.querySelector('#region-list'), layerList: document.querySelector('#layer-list'), deleteLayer: document.querySelector('#delete-layer'), activeRegionName: document.querySelector('#active-region-name'), visibleRegionCount: document.querySelector('#visible-region-count'), analysisCoords: document.querySelector('#analysis-coords'), detailPanel: document.querySelector('#detail-panel'), rulePanel: document.querySelector('#rule-panel'), auraPanel: document.querySelector('#aura-panel'), detailCategory: document.querySelector('#detail-category'), detailName: document.querySelector('#detail-name'), detailDescription: document.querySelector('#detail-description'), detailTags: document.querySelector('#detail-tags'), detailSections: document.querySelector('#detail-sections'), analysisSummary: document.querySelector('#analysis-summary'), hitRegionList: document.querySelector('#hit-region-list'), ruleResolutionList: document.querySelector('#rule-resolution-list'), auraGrid: document.querySelector('#aura-grid'), editorPanel: document.querySelector('#editor-panel'), editorSections: document.querySelector('#region-editor-sections'), saveRegion: document.querySelector('#save-region'), resetEditor: document.querySelector('#reset-editor'), deleteRegion: document.querySelector('#delete-region'), viewModeControl: document.querySelector('#view-mode-control') };
const map = L.map('map', { crs: L.CRS.Simple, minZoom: -2, maxZoom: 3, zoomSnap: 0.25, attributionControl: false });
let bounds = [[0, 0], [state.scene.height, state.scene.width]];
let overlay = L.imageOverlay(state.scene.url, bounds, { interactive: false }).addTo(map);
const drawnItems = new L.FeatureGroup().addTo(map);
map.fitBounds(bounds);
L.control.zoom({ position: 'bottomright' }).addTo(map);
map.addControl(new L.Control.Draw({ position: 'topleft', draw: { polyline: false, marker: false, circlemarker: false, polygon: { allowIntersection: false, shapeOptions: { color: CATEGORY_COLORS.BaseSeaArea, weight: 2, fillOpacity: 0.28 } }, rectangle: { shapeOptions: { color: CATEGORY_COLORS.PoiInfluenceArea, weight: 2, fillOpacity: 0.28 } }, circle: { shapeOptions: { color: CATEGORY_COLORS.EventArea, weight: 2, fillOpacity: 0.28 } } }, edit: { featureGroup: drawnItems } }));
function clone(v) { return JSON.parse(JSON.stringify(v)); }
function uid(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`; }
function listText(text) { return text.split('\n').map((v) => v.trim()).filter(Boolean); }
function selectedRegion() { return state.regions.find((region) => region.RegionId === state.selectedId) || null; }
function allFields() { return state.schema.sections.flatMap((section) => section.fields || []); }
function schemaField(key) { return allFields().find((field) => field.key === key) || null; }
function fieldLabel(key) { return schemaField(key)?.label || key; }
function fieldDefaultValue(field) { if (field.type === 'multiselect' || field.type === 'list') return []; if (field.type === 'boolean') return false; if (field.type === 'number') return 0; if (field.source && state.demoConfig.tagEnums[field.source]?.length) return state.demoConfig.tagEnums[field.source][0]; if (field.source === 'RegionCategory') return state.options.RegionCategory[0] || ''; return ''; }
function normalizeFieldValue(field, value) { if (field.type === 'number') return Number(value || 0); if (field.type === 'boolean') return value !== undefined ? Boolean(value) : false; if (field.type === 'multiselect' || field.type === 'list') return Array.isArray(value) ? value.map(String).filter(Boolean) : []; return value === undefined || value === null ? '' : String(value); }
function escapeHtml(value) { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;'); }
function formatFieldValue(field, value) { if (field.type === 'boolean') return value ? 'true' : 'false'; if (field.type === 'multiselect' || field.type === 'list') return Array.isArray(value) && value.length ? value.join(' / ') : '-'; return value === undefined || value === null || value === '' ? '-' : String(value); }
function schemaSection(id) { return state.schema.sections.find((section) => section.id === id) || null; }
function regionBaseFields() { return schemaSection('basic')?.fields || []; }
function tooltipPills(values, tone = '') { if (!Array.isArray(values) || !values.length) return '<span class="map-tooltip-pill map-tooltip-pill--muted">-</span>'; return values.map((value) => `<span class="map-tooltip-pill${tone ? ` map-tooltip-pill--${tone}` : ''}">${escapeHtml(value)}</span>`).join(''); }
function tooltipRow(label, value, accent = false) { return `<div class="map-tooltip__row${accent ? ' map-tooltip__row--accent' : ''}"><span class="map-tooltip__label">${escapeHtml(label)}</span><span class="map-tooltip__value">${escapeHtml(value)}</span></div>`; }
function tooltipSection(title, content) { return `<section class="map-tooltip__section"><div class="map-tooltip__section-title">${escapeHtml(title)}</div>${content}</section>`; }
function regionBaseTooltip(region) {
  const rows = regionBaseFields()
    .filter((field) => !['Name', 'RegionId', 'RegionCategory', 'Tags'].includes(field.key))
    .map((field) => tooltipRow(field.label, formatFieldValue(field, region[field.key])))
    .join('');
  return `
    <div class="map-tooltip map-tooltip--region">
      <div class="map-tooltip__header">
        <span class="map-tooltip__eyebrow">Region View</span>
        <strong class="map-tooltip__title">${escapeHtml(region.Name || region.RegionId)}</strong>
        <div class="map-tooltip__meta">${tooltipPills([region.RegionCategory || 'Uncategorized'], 'accent')}</div>
      </div>
      ${tooltipSection('Tags', `<div class="map-tooltip__pills">${tooltipPills(region.Tags)}</div>`) }
      ${tooltipSection('Base Attributes', `<div class="map-tooltip__rows">${tooltipRow('RegionId', region.RegionId || '-')}${rows || tooltipRow('Status', 'No extra fields')}</div>`) }
    </div>`;
}
function regionAuraTooltip(region) {
  const auraEntries = Object.entries(region.AuraSummary || {}).map(([key, values]) => tooltipSection(key, `<div class="map-tooltip__pills">${tooltipPills(Array.isArray(values) && values.length ? values : ['No Aura'], key.toLowerCase())}</div>`)).join('');
  return `
    <div class="map-tooltip map-tooltip--aura">
      <div class="map-tooltip__header">
        <span class="map-tooltip__eyebrow">Aura View</span>
        <strong class="map-tooltip__title">${escapeHtml(region.Name || region.RegionId)}</strong>
        <div class="map-tooltip__meta">${tooltipPills([region.RegionCategory || 'Uncategorized'], 'accent')}</div>
      </div>
      ${auraEntries}
    </div>`;
}
function tooltipContentForRegion(region) { return state.viewMode === 'aura' ? regionAuraTooltip(region) : regionBaseTooltip(region); }
function rulePopupContent() {
  if (!state.analysis) {
    return `<div class="map-tooltip map-tooltip--rule"><div class="map-tooltip__header"><span class="map-tooltip__eyebrow">Rule View</span><strong class="map-tooltip__title">当前位置未命中区域</strong></div><div class="map-tooltip__empty">点击重叠区域附近，查看各规则域的胜出 Tag。</div></div>`;
  }
  const summary = `<div class="map-tooltip__summary-chip">命中区域 ${state.analysis.hits.length}</div>`;
  const rows = state.analysis.resolutions.map((resolution) => `
    <div class="map-tooltip__row map-tooltip__row--accent">
      <span class="map-tooltip__label">${escapeHtml(fieldLabel(resolution.tagField))}</span>
      <span class="map-tooltip__value">${escapeHtml(resolution.winner?.tag || '-')}</span>
    </div>`).join('');
  return `
    <div class="map-tooltip map-tooltip--rule">
      <div class="map-tooltip__header">
        <span class="map-tooltip__eyebrow">Rule View</span>
        <strong class="map-tooltip__title">当前位置胜出 Tag</strong>
        <div class="map-tooltip__meta">${summary}</div>
      </div>
      <div class="map-tooltip__rows">${rows}</div>
    </div>`;
}
function closeRulePopup() { if (state.rulePopup) { map.closePopup(state.rulePopup); state.rulePopup = null; } }
function openRulePopup(latlng) { closeRulePopup(); state.rulePopup = L.popup({ closeButton: false, autoClose: false, closeOnClick: false, autoPan: false, offset: [0, -16], className: 'rule-hover-popup map-popup-shell' }).setLatLng(latlng).setContent(rulePopupContent()).openOn(map); }
function updateRightPanelVisibility() {
  const showRule = state.viewMode === 'rule';
  document.body.classList.toggle('view-mode-rule', showRule);
  document.body.classList.toggle('view-mode-nonrule', !showRule);
  if (els.layerPanel) els.layerPanel.style.display = '';
  if (els.editorPanel) els.editorPanel.style.display = '';
  if (els.detailPanel) els.detailPanel.style.display = 'none';
  if (els.auraPanel) els.auraPanel.style.display = 'none';
  if (els.rulePanel) els.rulePanel.style.display = '';
}
function loadLocalImage(file, callback) { const reader = new FileReader(); reader.onload = () => callback(reader.result); reader.readAsDataURL(file); }
function loadTextFile(file, callback) { const reader = new FileReader(); reader.onload = () => callback(reader.result); reader.readAsText(file, 'utf-8'); }
function normalizeScene(scene) { return { url: scene?.url || DEFAULT_SCENE.url, width: Number(scene?.width) || DEFAULT_SCENE.width, height: Number(scene?.height) || DEFAULT_SCENE.height }; }
function normalizeOptions(options) { return { Tags: Array.isArray(options?.Tags) ? options.Tags.map(String).filter(Boolean) : clone(DEFAULT_OPTIONS.Tags), RegionCategory: Array.isArray(options?.RegionCategory) ? options.RegionCategory.map(String).filter(Boolean) : clone(DEFAULT_OPTIONS.RegionCategory) }; }
function normalizeDemoConfig(config) { const base = clone(DEMO_CONFIG); if (!config) return base; Object.keys(base.tagEnums).forEach((key) => { if (Array.isArray(config?.tagEnums?.[key])) base.tagEnums[key] = config.tagEnums[key].map(String); }); Object.keys(base.priorities).forEach((key) => { if (config?.priorities?.[key]) base.priorities[key] = { ...base.priorities[key], ...config.priorities[key] }; }); return base; }
function normalizeRuleProfiles(config) {
  const base = clone(DEFAULT_RULE_PROFILES);
  if (!config || typeof config !== 'object') return base;
  Object.keys(base).forEach((profileGroup) => {
    const source = config?.[profileGroup];
    if (!source || typeof source !== 'object') return;
    const nextGroup = {};
    Object.entries(source).forEach(([profileId, profile]) => {
      nextGroup[String(profileId)] = {
        ProfileId: String(profile?.ProfileId || profileId),
        Name: String(profile?.Name || profileId),
        Description: String(profile?.Description || ''),
        Aura: ensureAuraSummary(profile?.Aura),
      };
    });
    base[profileGroup] = nextGroup;
  });
  return base;
}
function normalizeSchema(schema) { if (!schema || !Array.isArray(schema.sections) || !schema.sections.length) return clone(DEFAULT_SCHEMA); return { sections: schema.sections.map((section, index) => ({ id: section.id || `section-${index + 1}`, title: section.title || section.id || `Section ${index + 1}`, fields: Array.isArray(section.fields) ? section.fields.map((field, fieldIndex) => ({ key: field.key || `Field${index + 1}_${fieldIndex + 1}`, label: field.label || field.key || `Field ${fieldIndex + 1}`, type: field.type || 'text', source: field.source || null })) : [] })) }; }
function normalizeGeometry(geometry) { if (geometry?.Type === 'Circle') return { Type: 'Circle', Points: [], Center: [Number(geometry.Center?.[0]) || 0, Number(geometry.Center?.[1]) || 0], Radius: Number(geometry.Radius || 0) }; const points = Array.isArray(geometry?.Points) ? geometry.Points.map((point) => [Number(point[0]) || 0, Number(point[1]) || 0]) : []; return { Type: geometry?.Type === 'Rectangle' ? 'Rectangle' : 'Polygon', Points: points, Center: [], Radius: 0 }; }
function ensureAuraSummary(value) { return { Environment: Array.isArray(value?.Environment) ? value.Environment : [], Fishing: Array.isArray(value?.Fishing) ? value.Fishing : [], Navigation: Array.isArray(value?.Navigation) ? value.Navigation : [], FishSpawn: Array.isArray(value?.FishSpawn) ? value.FishSpawn : [] }; }
function profileGroupForDomain(domain) { return domain.id.replace('Rule', 'Profile'); }
function profileForDomain(domain, profileId) {
  if (!profileId) return null;
  const group = profileGroupForDomain(domain);
  return state.ruleProfiles?.[group]?.[profileId] || null;
}
function resolvedAuraForDomain(domain, region) {
  const profile = profileForDomain(domain, region?.[domain.profileField]);
  if (profile) return ensureAuraSummary(profile.Aura)[domain.summaryKey] || [];
  return ensureAuraSummary(region?.AuraSummary)[domain.summaryKey] || [];
}
function getDefaultTag(field) { return state.demoConfig.tagEnums[field]?.[0] || ''; }
function normalizeRegion(region) { const next = { ...(region || {}) }; next.RegionId = String(next.RegionId || uid('region')); next.Name = String(next.Name || ''); next.RegionCategory = String(next.RegionCategory || state.options.RegionCategory[0] || DEFAULT_OPTIONS.RegionCategory[0]); next.Tags = Array.isArray(next.Tags) ? next.Tags.map(String).filter(Boolean) : []; next.Priority = Number(next.Priority || 0); next.Enabled = next.Enabled !== undefined ? Boolean(next.Enabled) : true; next.GeometryIds = Array.isArray(next.GeometryIds) ? next.GeometryIds.map(String).filter(Boolean) : []; next.EnvironmentTag = String(next.EnvironmentTag || getDefaultTag('EnvironmentTag')); next.AccessTag = String(next.AccessTag || getDefaultTag('AccessTag')); next.FishingInteractionTag = String(next.FishingInteractionTag || getDefaultTag('FishingInteractionTag')); next.NavigationInteractionTag = String(next.NavigationInteractionTag || getDefaultTag('NavigationInteractionTag')); next.FishSpawnTag = String(next.FishSpawnTag || getDefaultTag('FishSpawnTag')); next.EnvironmentProfileId = String(next.EnvironmentProfileId || ''); next.AccessProfileId = String(next.AccessProfileId || ''); next.FishingInteractionProfileId = String(next.FishingInteractionProfileId || ''); next.NavigationInteractionProfileId = String(next.NavigationInteractionProfileId || ''); next.FishSpawnProfileId = String(next.FishSpawnProfileId || ''); next.SortOrder = Number(next.SortOrder || 0); next.Description = String(next.Description || ''); next.AuraSummary = ensureAuraSummary(next.AuraSummary); next.Geometry = normalizeGeometry(next.Geometry); delete next.ParentRegionId; delete next.LinkedPoiIds; allFields().forEach((field) => { next[field.key] = normalizeFieldValue(field, next[field.key] !== undefined ? next[field.key] : fieldDefaultValue(field)); }); if (!next.GeometryIds.length) next.GeometryIds = [`geom-${next.RegionId}`]; return next; }
function normalizeSketchLayer(layer, index) { return { LayerId: String(layer?.LayerId || uid('sketch')), LayerType: 'Sketch', Name: String(layer?.Name || `线稿图层 ${index + 1}`), Geometry: { Type: 'OpenPath', Points: Array.isArray(layer?.Geometry?.Points) ? layer.Geometry.Points.map((point) => [Number(point[0]) || 0, Number(point[1]) || 0]) : [] }, Style: { Color: layer?.Style?.Color || '#ffffff', Weight: Number(layer?.Style?.Weight || 3), DashArray: layer?.Style?.DashArray || '8 6' } }; }
function saveStorage() { localStorage.setItem(STORAGE_KEY, JSON.stringify({ scene: state.scene, options: state.options, schema: state.schema, demoConfig: state.demoConfig, ruleProfiles: state.ruleProfiles, regions: state.regions, sketchLayers: state.sketchLayers, showUnmatched: state.showUnmatched, viewMode: state.viewMode })); }
function setScene(url, width, height, persist = true) { state.scene = { url, width, height }; bounds = [[0, 0], [height, width]]; if (overlay) map.removeLayer(overlay); overlay = L.imageOverlay(url, bounds, { interactive: false }).addTo(map); map.fitBounds(bounds); if (persist) saveStorage(); }
function loadStorage() { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return false; try { const parsed = JSON.parse(raw); state.options = normalizeOptions(parsed.options); state.demoConfig = normalizeDemoConfig(parsed.demoConfig); state.ruleProfiles = normalizeRuleProfiles(parsed.ruleProfiles); state.schema = normalizeSchema(parsed.schema); const scene = normalizeScene(parsed.scene); setScene(scene.url, scene.width, scene.height, false); state.regions = Array.isArray(parsed.regions) ? parsed.regions.map(normalizeRegion) : []; state.sketchLayers = Array.isArray(parsed.sketchLayers) ? parsed.sketchLayers.map(normalizeSketchLayer) : []; state.showUnmatched = parsed.showUnmatched !== undefined ? Boolean(parsed.showUnmatched) : true; state.viewMode = parsed.viewMode || 'region'; return true; } catch (error) { console.error(error); return false; } }
function exportPayload() { return { version: 5, scene: state.scene, options: state.options, schema: state.schema, demoConfig: state.demoConfig, ruleProfiles: state.ruleProfiles, regions: state.regions, sketchLayers: state.sketchLayers }; }
function importConfig(text) { const parsed = JSON.parse(text); state.options = normalizeOptions(parsed.options); state.demoConfig = normalizeDemoConfig(parsed.demoConfig); state.ruleProfiles = normalizeRuleProfiles(parsed.ruleProfiles); state.schema = normalizeSchema(parsed.schema); const scene = normalizeScene(parsed.scene); setScene(scene.url, scene.width, scene.height, false); state.regions = (Array.isArray(parsed.regions) ? parsed.regions : []).map(normalizeRegion); state.sketchLayers = (Array.isArray(parsed.sketchLayers) ? parsed.sketchLayers : []).map(normalizeSketchLayer); state.selectedId = null; state.selectedLayerKey = null; state.analysis = null; ensureFilterDefaults(true); syncTextareas(); saveStorage(); fillEditor(null); renderAll(); fitToRenderedLayers(); }
function loadSample(includeRegions = true) { state.options = clone(DEFAULT_OPTIONS); state.demoConfig = clone(DEMO_CONFIG); state.ruleProfiles = clone(DEFAULT_RULE_PROFILES); state.schema = clone(DEFAULT_SCHEMA); state.regions = includeRegions ? SAMPLE_REGIONS.map(normalizeRegion) : []; state.sketchLayers = []; state.selectedId = null; state.selectedLayerKey = null; state.analysis = null; state.showUnmatched = true; state.viewMode = 'region'; ensureFilterDefaults(true); syncTextareas(); saveStorage(); fillEditor(null); renderAll(); if (includeRegions) fitToRenderedLayers(); }
function geometryFromLayer(layer) { if (layer instanceof L.Circle) { const center = layer.getLatLng(); return { Type: 'Circle', Points: [], Center: [center.lng, center.lat], Radius: layer.getRadius() }; } return { Type: layer instanceof L.Rectangle ? 'Rectangle' : 'Polygon', Points: (layer.getLatLngs()[0] || []).map((point) => [point.lng, point.lat]), Center: [], Radius: 0 }; }
function layerFromRegion(region) { if (region.Geometry.Type === 'Circle') return L.circle([region.Geometry.Center[1], region.Geometry.Center[0]], { radius: region.Geometry.Radius }); const points = region.Geometry.Points.map((point) => [point[1], point[0]]); return region.Geometry.Type === 'Rectangle' ? L.rectangle(points) : L.polygon(points); }
function normalizePoint(point) { const length = Math.hypot(point.x, point.y) || 1; return { x: point.x / length, y: point.y / length }; }
function strokeToPolygon(points, radius) { if (points.length < 2) { const point = points[0]; return [[point.lng - radius, point.lat - radius], [point.lng + radius, point.lat - radius], [point.lng + radius, point.lat + radius], [point.lng - radius, point.lat + radius]]; } const left = []; const right = []; for (let i = 0; i < points.length; i += 1) { const prev = points[Math.max(0, i - 1)]; const next = points[Math.min(points.length - 1, i + 1)]; const tangent = normalizePoint({ x: next.lng - prev.lng, y: next.lat - prev.lat }); const normal = { x: -tangent.y, y: tangent.x }; left.push([points[i].lng + normal.x * radius, points[i].lat + normal.y * radius]); right.unshift([points[i].lng - normal.x * radius, points[i].lat - normal.y * radius]); } return [...left, ...right]; }
function pointInPolygon(point, points) { let inside = false; for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) { const xi = points[i][0], yi = points[i][1], xj = points[j][0], yj = points[j][1]; const intersect = ((yi > point[1]) !== (yj > point[1])) && (point[0] < ((xj - xi) * (point[1] - yi)) / ((yj - yi) || 1e-6) + xi); if (intersect) inside = !inside; } return inside; }
function regionContainsPoint(region, xy) { if (region.Geometry.Type === 'Circle') { const dx = xy[0] - region.Geometry.Center[0]; const dy = xy[1] - region.Geometry.Center[1]; return Math.hypot(dx, dy) <= region.Geometry.Radius; } return pointInPolygon(xy, region.Geometry.Points); }
function tagPriority(tagField, tag) { return state.demoConfig.priorities[tagField]?.[tag] || 0; }
function resolveRuleDomain(hitRegions, domain) { const candidates = hitRegions.filter((region) => region[domain.tagField]).map((region) => { const profile = profileForDomain(domain, region[domain.profileField]); return { regionId: region.RegionId, regionName: region.Name || region.RegionId, tag: region[domain.tagField], priority: tagPriority(domain.tagField, region[domain.tagField]), regionPriority: Number(region.Priority || 0), profileId: region[domain.profileField] || '', profileName: profile?.Name || '', aura: resolvedAuraForDomain(domain, region) }; }).sort((a, b) => (b.priority - a.priority) || (b.regionPriority - a.regionPriority) || a.regionName.localeCompare(b.regionName, 'zh-CN')); const winner = candidates[0] || null; return { domainId: domain.id, domainLabel: domain.label, tagField: domain.tagField, profileField: domain.profileField, candidates, winner }; }
function analyzeAtPoint(xy) { const hitRegions = state.regions.filter((region) => region.Enabled && regionContainsPoint(region, xy)); const resolutions = RULE_DOMAINS.map((domain) => resolveRuleDomain(hitRegions, domain)); const aura = { Environment: [], Fishing: [], Navigation: [], FishSpawn: [] }; resolutions.forEach((resolution) => { if (!resolution.winner) return; if (resolution.domainId === 'EnvironmentRule') aura.Environment = resolution.winner.aura || []; if (resolution.domainId === 'FishingInteractionRule') aura.Fishing = resolution.winner.aura || []; if (resolution.domainId === 'NavigationInteractionRule' || resolution.domainId === 'AccessRule') aura.Navigation = [...new Set([...(aura.Navigation || []), ...(resolution.winner.aura || [])])]; if (resolution.domainId === 'FishSpawnRule') aura.FishSpawn = resolution.winner.aura || []; }); state.analysis = { xy, hitRegions, resolutions, aura }; }
function regionCenter(region) { if (region.Geometry.Type === 'Circle') return region.Geometry.Center; const xs = region.Geometry.Points.map((point) => point[0]); const ys = region.Geometry.Points.map((point) => point[1]); return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2]; }
function syncTextareas() { els.optionsTags.value = state.options.Tags.join('\n'); els.optionsCategories.value = state.options.RegionCategory.join('\n'); if (els.demoConfig) els.demoConfig.value = JSON.stringify(state.demoConfig, null, 2); els.schemaConfig.value = JSON.stringify(state.schema, null, 2); els.toggleUnmatched.textContent = state.showUnmatched ? '显示全部' : '仅显示命中'; [...els.viewModeControl.querySelectorAll('button')].forEach((button) => button.classList.toggle('is-active', button.dataset.viewMode === state.viewMode)); }
function setSelectOptions(select, values, selectedSet) { select.innerHTML = values.map((value) => `<option value="${value}">${value}</option>`).join(''); [...select.options].forEach((option) => { option.selected = selectedSet.has(option.value); }); }
function ensureFilterDefaults(force = false) { if (!force) return; state.filters.tags = new Set(state.options.Tags); state.filters.categories = new Set(state.options.RegionCategory); state.filters.enabled = new Set(FILTER_BOOLEAN_OPTIONS); state.filters.environment = new Set(state.demoConfig.tagEnums.EnvironmentTag); state.filters.access = new Set(state.demoConfig.tagEnums.AccessTag); state.filters.fishing = new Set(state.demoConfig.tagEnums.FishingInteractionTag); state.filters.navigation = new Set(state.demoConfig.tagEnums.NavigationInteractionTag); state.filters.spawn = new Set(state.demoConfig.tagEnums.FishSpawnTag); }
function syncFilterState() { state.filters.tags = new Set([...els.tagFilter.selectedOptions].map((option) => option.value)); state.filters.categories = new Set([...els.categoryFilter.selectedOptions].map((option) => option.value)); state.filters.enabled = new Set([...els.enabledFilter.selectedOptions].map((option) => option.value)); state.filters.environment = new Set([...els.environmentFilter.selectedOptions].map((option) => option.value)); state.filters.access = new Set([...els.accessFilter.selectedOptions].map((option) => option.value)); state.filters.fishing = new Set([...els.fishingFilter.selectedOptions].map((option) => option.value)); state.filters.navigation = new Set([...els.navigationFilter.selectedOptions].map((option) => option.value)); state.filters.spawn = new Set([...els.spawnFilter.selectedOptions].map((option) => option.value)); }
function renderFilters() { setSelectOptions(els.tagFilter, state.options.Tags, state.filters.tags); setSelectOptions(els.categoryFilter, state.options.RegionCategory, state.filters.categories); setSelectOptions(els.enabledFilter, FILTER_BOOLEAN_OPTIONS, state.filters.enabled); setSelectOptions(els.environmentFilter, state.demoConfig.tagEnums.EnvironmentTag, state.filters.environment); setSelectOptions(els.accessFilter, state.demoConfig.tagEnums.AccessTag, state.filters.access); setSelectOptions(els.fishingFilter, state.demoConfig.tagEnums.FishingInteractionTag, state.filters.fishing); setSelectOptions(els.navigationFilter, state.demoConfig.tagEnums.NavigationInteractionTag, state.filters.navigation); setSelectOptions(els.spawnFilter, state.demoConfig.tagEnums.FishSpawnTag, state.filters.spawn); }
function allowFilter(set, allValues, predicate) { if (!allValues.length) return true; if (!set.size) return false; return predicate(); }
function matchesFilters(region) { return allowFilter(state.filters.tags, state.options.Tags, () => region.Tags.some((tag) => state.filters.tags.has(tag))) && allowFilter(state.filters.categories, state.options.RegionCategory, () => state.filters.categories.has(region.RegionCategory)) && allowFilter(state.filters.enabled, FILTER_BOOLEAN_OPTIONS, () => state.filters.enabled.has(region.Enabled ? 'Enabled' : 'Disabled')) && allowFilter(state.filters.environment, state.demoConfig.tagEnums.EnvironmentTag, () => state.filters.environment.has(region.EnvironmentTag)) && allowFilter(state.filters.access, state.demoConfig.tagEnums.AccessTag, () => state.filters.access.has(region.AccessTag)) && allowFilter(state.filters.fishing, state.demoConfig.tagEnums.FishingInteractionTag, () => state.filters.fishing.has(region.FishingInteractionTag)) && allowFilter(state.filters.navigation, state.demoConfig.tagEnums.NavigationInteractionTag, () => state.filters.navigation.has(region.NavigationInteractionTag)) && allowFilter(state.filters.spawn, state.demoConfig.tagEnums.FishSpawnTag, () => state.filters.spawn.has(region.FishSpawnTag)); }
function winnerRegionIds() { if (!state.analysis) return new Set(); return new Set(state.analysis.resolutions.filter((resolution) => resolution.winner).map((resolution) => resolution.winner.regionId)); }
function styleLayer(layer, region, matched, selected) { const baseColor = CATEGORY_COLORS[region.RegionCategory] || CATEGORY_COLORS.BaseSeaArea; const isWinner = winnerRegionIds().has(region.RegionId); const hit = state.analysis?.hitRegions?.some((item) => item.RegionId === region.RegionId); let color = baseColor; let fillOpacity = matched ? 0.28 : 0.08; let opacity = matched ? 0.96 : 0.18; let weight = selected ? 4 : 2; if (state.viewMode === 'rule') { if (isWinner) { color = '#f9d46b'; fillOpacity = 0.42; opacity = 1; weight = 5; } else if (hit) { color = '#7dd3fc'; fillOpacity = 0.22; opacity = 0.88; } } if (state.viewMode === 'aura') { if (hit) { color = '#6ee7f9'; fillOpacity = 0.36; opacity = 0.98; weight = 4; } if (isWinner) { color = '#fde68a'; fillOpacity = 0.5; opacity = 1; weight = 5; } } layer.setStyle({ color, weight, fillColor: color, fillOpacity, opacity }); }
function formatTagSummary(region) { return `E:${region.EnvironmentTag} | A:${region.AccessTag} | F:${region.FishingInteractionTag} | N:${region.NavigationInteractionTag} | S:${region.FishSpawnTag}`; }
function renderRuleConfig() { els.ruleBindingList.innerHTML = RULE_DOMAINS.map((domain) => `<div class="rule-summary-card"><strong>${domain.label}</strong><span>绑定 TagCategory: ${fieldLabel(domain.tagField)}</span><span>输出 Profile: ${fieldLabel(domain.profileField)}</span></div>`).join(''); els.priorityBoard.innerHTML = Object.entries(state.demoConfig.priorities).map(([field, priorityMap]) => { const ordered = Object.entries(priorityMap).sort((a, b) => b[1] - a[1]); return `<section class="priority-card"><div class="panel__header"><span>${fieldLabel(field)}</span><span class="panel__meta">Priority</span></div>${ordered.map(([tag, priority]) => `<div class="priority-row"><span>${tag}</span><strong>${priority}</strong></div>`).join('')}</section>`; }).join(''); }
function updateDetail(region) { if (!region) { els.activeRegionName.textContent = '未选择'; els.detailCategory.textContent = 'None'; els.detailName.textContent = '未选择区域'; els.detailDescription.textContent = '点击一个区域后，这里会按五类分区显示字段、规则映射和 Aura 摘要。'; els.detailTags.innerHTML = ''; els.detailSections.innerHTML = ''; return; } els.activeRegionName.textContent = region.Name || region.RegionId; els.detailCategory.textContent = region.RegionCategory; els.detailName.textContent = region.Name || region.RegionId; els.detailDescription.textContent = region.Description || '暂无备注。'; els.detailTags.innerHTML = (Array.isArray(region.Tags) ? region.Tags : []).map((tag) => `<span class="detail-tag">${escapeHtml(tag)}</span>`).join(''); const schemaSections = state.schema.sections.map((section) => { const fields = (section.fields || []).map((field) => `<div class="info-item"><span class="info-item__label">${escapeHtml(field.label)}</span><strong>${escapeHtml(formatFieldValue(field, region[field.key]))}</strong></div>`).join(''); return `<section class="schema-section"><div class="panel__header"><span>${escapeHtml(section.title)}</span><span class="panel__meta">${escapeHtml(section.id)}</span></div><div class="detail-grid">${fields || '<div class="empty-state">无字段</div>'}</div></section>`; }); const mappingSection = `<section class="schema-section"><div class="panel__header"><span>规则映射区</span><span class="panel__meta">Profiles</span></div><div class="detail-grid">${RULE_DOMAINS.map((domain) => { const profile = profileForDomain(domain, region[domain.profileField]); const label = profile ? `${profile.ProfileId} / ${profile.Name}` : (region[domain.profileField] || '-'); return `<div class="info-item"><span class="info-item__label">${escapeHtml(domain.label)}</span><strong>${escapeHtml(label)}</strong></div>`; }).join('')}</div></section>`; const auraSection = `<section class="schema-section"><div class="panel__header"><span>Aura 摘要区</span><span class="panel__meta">Aura</span></div><div class="detail-grid">${RULE_DOMAINS.map((domain) => `<div class="info-item"><span class="info-item__label">${escapeHtml(domain.label)}</span><strong>${escapeHtml((resolvedAuraForDomain(domain, region) || []).join(' / ') || '-')}</strong></div>`).join('')}</div></section>`; els.detailSections.innerHTML = `${schemaSections.join('')}${mappingSection}${auraSection}`; }
function fieldOptions(field) { if (field.source === 'Tags') return state.options.Tags; if (field.source === 'RegionCategory') return state.options.RegionCategory; if (field.source && state.demoConfig.tagEnums[field.source]) return state.demoConfig.tagEnums[field.source]; return []; }
function controlFor(field, value) { let control; const options = fieldOptions(field); if (field.type === 'textarea') { control = document.createElement('textarea'); control.rows = 4; control.value = value || ''; } else if (field.type === 'number') { control = document.createElement('input'); control.type = 'number'; control.value = Number(value || 0); } else if (field.type === 'boolean') { control = document.createElement('select'); control.innerHTML = '<option value="true">true</option><option value="false">false</option>'; control.value = value ? 'true' : 'false'; } else if (field.type === 'select') { control = document.createElement('select'); control.innerHTML = options.map((option) => `<option value="${option}">${option}</option>`).join(''); control.value = value || options[0] || ''; } else if (field.type === 'multiselect') { control = document.createElement('select'); control.multiple = true; control.size = Math.max(4, Math.min(8, options.length || 4)); control.innerHTML = options.map((option) => `<option value="${option}">${option}</option>`).join(''); [...control.options].forEach((option) => { option.selected = Array.isArray(value) && value.includes(option.value); }); } else if (field.type === 'list') { control = document.createElement('textarea'); control.rows = 4; control.value = Array.isArray(value) ? value.join('\n') : ''; } else { control = document.createElement('input'); control.type = 'text'; control.value = value || ''; } control.dataset.fieldKey = field.key; control.dataset.fieldType = field.type; return control; }
function renderEditorSections(region) { const data = region || normalizeRegion({ Geometry: { Type: 'Polygon', Points: [], Center: [], Radius: 0 } }); els.editorSections.innerHTML = state.schema.sections.map((section) => { const fieldsHtml = (section.fields || []).map((field) => { const wrapClass = (field.type === 'textarea' || field.type === 'multiselect' || field.type === 'list') ? 'form-field form-field--full' : 'form-field'; return `<label class="${wrapClass}" data-field-wrap="${field.key}"><span>${field.label}</span></label>`; }).join(''); return `<section class="schema-section"><div class="panel__header"><span>${section.title}</span><span class="panel__meta">${section.id}</span></div><div class="form-grid">${fieldsHtml}${section.id === 'spatial' ? `<label class="form-field form-field--full"><span>GeometryType</span><input type="text" value="${data.Geometry.Type}" readonly></label>` : ''}</div></section>`; }).join(''); state.schema.sections.forEach((section) => { section.fields.forEach((field) => { const wrap = els.editorSections.querySelector(`[data-field-wrap="${field.key}"]`); if (!wrap) return; wrap.appendChild(controlFor(field, data[field.key])); }); }); }
function fillEditor(region) { state.selectedId = region ? region.RegionId : null; renderEditorSections(region); els.deleteRegion.disabled = !region; updateDetail(region); }
function readEditorValues() { const out = {}; allFields().forEach((field) => { const input = els.editorSections.querySelector(`[data-field-key="${field.key}"]`); if (!input) return; if (field.type === 'number') out[field.key] = Number(input.value || 0); else if (field.type === 'boolean') out[field.key] = input.value === 'true'; else if (field.type === 'multiselect') out[field.key] = [...input.selectedOptions].map((option) => option.value); else if (field.type === 'list') out[field.key] = listText(input.value); else out[field.key] = input.value.trim(); }); return out; }
function renderRegionList(visibleRegions) { if (!state.regions.length) { els.regionList.innerHTML = '<div class="empty-state">还没有区域。请先绘制一个区域。</div>'; return; } els.regionList.innerHTML = visibleRegions.map((region) => `<button type="button" class="region-card${region.RegionId === state.selectedId ? ' is-active' : ''}" data-region-id="${region.RegionId}"><span><strong>${region.Name || region.RegionId}</strong><span class="region-card__meta">${region.RegionCategory} | ${region.Enabled ? 'Enabled' : 'Disabled'}</span></span><span class="panel__meta">${region.Tags.join('/') || '-'}</span></button>`).join(''); [...els.regionList.querySelectorAll('[data-region-id]')].forEach((button) => button.addEventListener('click', () => selectRegion(button.dataset.regionId, true))); }
function renderLayerList() { const items = [...state.regions.map((region) => ({ key: `region:${region.RegionId}`, title: region.Name || region.RegionId, meta: `${region.Geometry.Type} | ${region.RegionCategory}`, click: () => selectRegion(region.RegionId, true) })), ...state.sketchLayers.map((layer) => ({ key: `sketch:${layer.LayerId}`, title: layer.Name, meta: `${layer.Geometry.Type} | width ${layer.Style.Weight}`, click: () => { state.selectedLayerKey = `sketch:${layer.LayerId}`; renderLayerList(); } }))]; if (!items.length) { els.layerList.innerHTML = '<div class="empty-state">还没有图层。</div>'; return; } els.layerList.innerHTML = items.map((item) => `<button type="button" class="region-card${item.key === state.selectedLayerKey ? ' is-active' : ''}" data-layer-key="${item.key}"><span><strong>${item.title}</strong><span class="layer-card__type">${item.meta}</span></span></button>`).join(''); [...els.layerList.querySelectorAll('[data-layer-key]')].forEach((button, index) => button.addEventListener('click', items[index].click)); }
function renderAnalysisPanels() { if (!state.analysis) { els.analysisSummary.innerHTML = '<div class="empty-state">点击地图任意点，查看命中的 Region 与规则仲裁结果。</div>'; els.hitRegionList.innerHTML = '<div class="empty-state">等待选择分析点。</div>'; els.ruleResolutionList.innerHTML = '<div class="empty-state">Rule Resolution 会在这里显示各 RuleDomain 的胜出结果。</div>'; els.auraGrid.innerHTML = '<div class="empty-state">Aura View 会在这里展示最终效果摘要。</div>'; return; } const { xy, hitRegions, resolutions, aura } = state.analysis; els.analysisCoords.textContent = `${Math.round(xy[0])}, ${Math.round(xy[1])}`; els.analysisSummary.innerHTML = `<div class="analysis-card"><strong>命中区域 ${hitRegions.length}</strong><span>分析点坐标：${Math.round(xy[0])}, ${Math.round(xy[1])}</span><span>当前视图：${state.viewMode}</span></div>`; els.hitRegionList.innerHTML = hitRegions.length ? hitRegions.map((region) => `<button type="button" class="analysis-hit-card" data-hit-region="${region.RegionId}"><strong>${region.Name || region.RegionId}</strong><span>${region.RegionCategory}</span><small>${formatTagSummary(region)}</small></button>`).join('') : '<div class="empty-state">该点没有命中任何启用中的 Region。</div>'; [...els.hitRegionList.querySelectorAll('[data-hit-region]')].forEach((button) => button.addEventListener('click', () => selectRegion(button.dataset.hitRegion, true))); els.ruleResolutionList.innerHTML = resolutions.map((resolution) => { const candidateRows = resolution.candidates.length ? resolution.candidates.map((candidate) => `<div class="candidate-row${resolution.winner?.regionId === candidate.regionId ? ' is-winner' : ''}"><span>${candidate.regionName}</span><span>${candidate.tag}</span><strong>P${candidate.priority}</strong></div>`).join('') : '<div class="empty-state">无候选 Region</div>'; const winner = resolution.winner; const profileLabel = winner?.profileName ? `${winner.profileId} / ${winner.profileName}` : (winner?.profileId || '-'); return `<section class="resolution-card"><div class="panel__header"><span>${resolution.domainLabel}</span><span class="panel__meta">${fieldLabel(resolution.tagField)}</span></div><div class="candidate-list">${candidateRows}</div><div class="resolution-result"><span>Winning Region</span><strong>${winner?.regionName || '-'}</strong><span>Winning Tag</span><strong>${winner?.tag || '-'}</strong><span>Resolved Profile</span><strong>${profileLabel}</strong><span>Aura Summary</span><strong>${winner?.aura?.join(' / ') || '-'}</strong></div></section>`; }).join(''); els.auraGrid.innerHTML = Object.entries(aura).map(([key, values]) => `<section class="aura-card"><div class="panel__header"><span>${key} Aura</span><span class="panel__meta">Aura</span></div><div class="aura-lines">${(values || []).length ? values.map((value) => `<span>${value}</span>`).join('') : '<span>-</span>'}</div></section>`).join(''); }
function selectRegion(regionId, fit = false) { state.selectedId = regionId; state.selectedLayerKey = `region:${regionId}`; const region = selectedRegion(); fillEditor(region); if (region) analyzeAtPoint(regionCenter(region)); closeRulePopup(); renderRegions(); const layer = state.layers.get(`region:${regionId}`); if (fit && layer?.getBounds) map.fitBounds(layer.getBounds(), { padding: [40, 40] }); }
function renderRegions() { drawnItems.clearLayers(); state.layers.clear(); const visible = []; state.regions.forEach((region) => { const matched = matchesFilters(region); const selected = region.RegionId === state.selectedId; if (matched) visible.push(region); if (matched || state.showUnmatched) { const layer = layerFromRegion(region); layer.__regionId = region.RegionId; layer.__layerKey = `region:${region.RegionId}`; styleLayer(layer, region, matched, selected); if (state.viewMode !== 'rule') layer.bindTooltip(tooltipContentForRegion(region), { sticky: true, direction: 'top', opacity: 1, className: 'map-region-tooltip' }); layer.on('click', (event) => { if (state.viewMode === 'rule') { analyzeAtPoint([event.latlng.lng, event.latlng.lat]); renderAll(); openRulePopup(event.latlng); return; } selectRegion(region.RegionId, false); }); drawnItems.addLayer(layer); state.layers.set(layer.__layerKey, layer); } }); state.sketchLayers.forEach((item) => { const layer = L.polyline(item.Geometry.Points.map((point) => [point[1], point[0]]), { color: item.Style.Color, weight: item.Style.Weight, dashArray: item.Style.DashArray, opacity: 0.95 }); layer.__layerKey = `sketch:${item.LayerId}`; layer.bindTooltip(item.Name, { sticky: true }); layer.on('click', () => { state.selectedLayerKey = layer.__layerKey; renderLayerList(); }); drawnItems.addLayer(layer); state.layers.set(layer.__layerKey, layer); }); els.visibleRegionCount.textContent = String(visible.length); renderRegionList(visible); renderLayerList(); updateDetail(selectedRegion()); renderAnalysisPanels(); }
function renderAll() { updateRightPanelVisibility(); renderRuleConfig(); renderFilters(); renderRegions(); syncTextareas(); }
function fitToRenderedLayers() { const layers = [...state.layers.values()].filter((layer) => typeof layer.getBounds === 'function'); if (!layers.length) { map.fitBounds(bounds); return; } map.fitBounds(L.featureGroup(layers).getBounds(), { padding: [40, 40] }); }
function createRegion(geometry) { const region = normalizeRegion({ Geometry: geometry, RegionId: uid('region'), GeometryIds: [uid('geom')] }); state.regions.push(region); state.selectedId = region.RegionId; state.selectedLayerKey = `region:${region.RegionId}`; analyzeAtPoint(regionCenter(region)); saveStorage(); renderAll(); fillEditor(region); }
map.on(L.Draw.Event.CREATED, (event) => createRegion(geometryFromLayer(event.layer)));
map.on(L.Draw.Event.EDITED, (event) => { event.layers.eachLayer((layer) => { const region = state.regions.find((item) => item.RegionId === layer.__regionId); if (region) region.Geometry = geometryFromLayer(layer); }); saveStorage(); renderAll(); });
map.on(L.Draw.Event.DELETED, (event) => { const ids = []; event.layers.eachLayer((layer) => { if (layer.__regionId) ids.push(layer.__regionId); }); state.regions = state.regions.filter((region) => !ids.includes(region.RegionId)); if (ids.includes(state.selectedId)) fillEditor(null); saveStorage(); renderAll(); });
map.on('mousedown', (event) => { if (state.sketch.enabled) { state.sketch.drawing = true; state.sketch.points = [event.latlng]; map.dragging.disable(); if (state.sketch.preview) map.removeLayer(state.sketch.preview); state.sketch.preview = null; return; } if (!state.brush.enabled) return; state.brush.drawing = true; state.brush.points = [event.latlng]; map.dragging.disable(); if (state.brush.preview) map.removeLayer(state.brush.preview); state.brush.preview = null; });
map.on('mousemove', (event) => { els.analysisCoords.textContent = `${Math.round(event.latlng.lng)}, ${Math.round(event.latlng.lat)}`; if (state.sketch.enabled && state.sketch.drawing) { state.sketch.points.push(event.latlng); if (state.sketch.preview) map.removeLayer(state.sketch.preview); state.sketch.preview = L.polyline(state.sketch.points, { color: '#ffffff', weight: state.sketch.width, dashArray: '8 6', opacity: 0.95, interactive: false }).addTo(map); return; } if (!state.brush.enabled || !state.brush.drawing) return; state.brush.points.push(event.latlng); const outline = strokeToPolygon(state.brush.points, state.brush.radius); if (state.brush.preview) map.removeLayer(state.brush.preview); state.brush.preview = L.polygon(outline.map((point) => [point[1], point[0]]), { color: '#38bdf8', weight: 2, fillColor: '#38bdf8', fillOpacity: 0.18, interactive: false }).addTo(map); });
function endBrush() { if (!state.brush.enabled || !state.brush.drawing) return; state.brush.drawing = false; map.dragging.enable(); if (state.brush.points.length >= 2) createRegion({ Type: 'Polygon', Points: strokeToPolygon(state.brush.points, state.brush.radius), Center: [], Radius: 0 }); if (state.brush.preview) map.removeLayer(state.brush.preview); state.brush.preview = null; state.brush.points = []; }
function endSketch() { if (!state.sketch.enabled || !state.sketch.drawing) return; state.sketch.drawing = false; map.dragging.enable(); if (state.sketch.points.length >= 2) { state.sketchLayers.push(normalizeSketchLayer({ Geometry: { Points: state.sketch.points.map((point) => [point.lng, point.lat]) }, Style: { Weight: state.sketch.width } }, state.sketchLayers.length)); saveStorage(); renderAll(); } if (state.sketch.preview) map.removeLayer(state.sketch.preview); state.sketch.preview = null; state.sketch.points = []; }
map.on('mouseup', () => { if (state.sketch.drawing) endSketch(); else endBrush(); });
map.on('mouseout', () => { if (state.sketch.drawing) endSketch(); if (state.brush.drawing) endBrush(); });
map.on('click', (event) => { if (!state.analysisEnabled || state.brush.enabled || state.sketch.enabled) return; analyzeAtPoint([event.latlng.lng, event.latlng.lat]); renderAll(); if (state.viewMode === 'rule') openRulePopup(event.latlng); else closeRulePopup(); });

els.mapUpload.addEventListener('change', (event) => { const file = event.target.files?.[0]; if (!file) return; loadLocalImage(file, (result) => { const image = new Image(); image.onload = () => setScene(result, image.width, image.height); image.src = result; }); });
els.applyOptions.addEventListener('click', () => { state.options = { Tags: listText(els.optionsTags.value), RegionCategory: listText(els.optionsCategories.value) }; try { state.demoConfig = normalizeDemoConfig(JSON.parse(els.demoConfig.value)); state.schema = normalizeSchema(JSON.parse(els.schemaConfig.value)); } catch (error) { console.error(error); els.detailCategory.textContent = 'Error'; els.detailName.textContent = 'Schema / Tag 配置解析失败'; els.detailDescription.textContent = '请检查 Tag / Priority 配置 JSON 和 Region Schema JSON。'; return; } state.regions = state.regions.map(normalizeRegion); ensureFilterDefaults(true); saveStorage(); renderAll(); fillEditor(selectedRegion()); });
els.loadSample.addEventListener('click', () => loadSample(true));
els.configUpload.addEventListener('change', (event) => { const file = event.target.files?.[0]; if (!file) return; loadTextFile(file, (text) => { try { importConfig(text); els.configUpload.value = ''; } catch (error) { console.error(error); els.detailCategory.textContent = 'Error'; els.detailName.textContent = '导入失败'; els.detailDescription.textContent = 'JSON 解析失败，请检查文件格式。'; } }); });
els.exportConfig.addEventListener('click', () => { const blob = new Blob([JSON.stringify(exportPayload(), null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'offshore-fishing-regions.json'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); });
els.clearStorage.addEventListener('click', () => { localStorage.removeItem(STORAGE_KEY); state.scene = { ...DEFAULT_SCENE }; state.options = clone(DEFAULT_OPTIONS); state.schema = clone(DEFAULT_SCHEMA); state.demoConfig = clone(DEMO_CONFIG); state.regions = []; state.sketchLayers = []; state.selectedId = null; state.selectedLayerKey = null; state.analysis = null; state.showUnmatched = true; state.viewMode = 'region'; ensureFilterDefaults(true); setScene(state.scene.url, state.scene.width, state.scene.height, false); fillEditor(null); renderAll(); });
[els.tagFilter, els.categoryFilter, els.enabledFilter, els.environmentFilter, els.accessFilter, els.fishingFilter, els.navigationFilter, els.spawnFilter].forEach((select) => select.addEventListener('change', () => { syncFilterState(); renderAll(); }));
els.resetFilters.addEventListener('click', () => { ensureFilterDefaults(true); renderAll(); });
els.toggleUnmatched.addEventListener('click', () => { state.showUnmatched = !state.showUnmatched; renderAll(); });
[...els.viewModeControl.querySelectorAll('button')].forEach((button) => button.addEventListener('click', () => { state.viewMode = button.dataset.viewMode; if (state.viewMode !== 'rule') closeRulePopup(); saveStorage(); renderAll(); }));
els.saveRegion.addEventListener('click', () => { const region = selectedRegion(); if (!region) { els.detailDescription.textContent = '请先绘制一个区域，再填写右侧表单。'; return; } const previousId = region.RegionId; Object.assign(region, readEditorValues()); region.RegionId = region.RegionId || previousId || uid('region'); if (!region.GeometryIds.length) region.GeometryIds = [`geom-${region.RegionId}`]; region.AuraSummary = ensureAuraSummary(region.AuraSummary); state.selectedId = region.RegionId; state.selectedLayerKey = `region:${region.RegionId}`; saveStorage(); renderAll(); fillEditor(region); });
els.resetEditor.addEventListener('click', () => fillEditor(selectedRegion()));
els.deleteRegion.addEventListener('click', () => { if (!state.selectedId) return; state.regions = state.regions.filter((region) => region.RegionId !== state.selectedId); state.selectedId = null; state.selectedLayerKey = null; state.analysis = null; saveStorage(); fillEditor(null); renderAll(); });
els.deleteLayer.addEventListener('click', () => { if (!state.selectedLayerKey) return; const [kind, rawId] = state.selectedLayerKey.split(':'); if (kind === 'region') state.regions = state.regions.filter((region) => region.RegionId !== rawId); if (kind === 'sketch') state.sketchLayers = state.sketchLayers.filter((layer) => layer.LayerId !== rawId); if (state.selectedId === rawId) state.selectedId = null; state.selectedLayerKey = null; state.analysis = null; saveStorage(); fillEditor(null); renderAll(); });
const hasStorage = loadStorage(); if (!hasStorage) loadSample(true); ensureFilterDefaults(true); syncTextareas(); fillEditor(null); renderAll();













