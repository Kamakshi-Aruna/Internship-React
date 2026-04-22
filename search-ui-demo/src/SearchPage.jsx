import { useState, useMemo } from "react";
import { Input, Select, Space, Typography, Tag, Empty, Divider } from "antd";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";

import CANDIDATES from "./data/candidates";
import useDebounce from "./hooks/useDebounce";
import FacetPanel from "./components/FacetPanel";
import ResultCard from "./components/ResultCard";

const { Title, Text } = Typography;

// Sort options for the Select dropdown
const SORT_OPTIONS = [
  { value: "relevance",   label: "Sort: Relevance"         },
  { value: "exp_desc",    label: "Sort: Experience (High → Low)" },
  { value: "exp_asc",     label: "Sort: Experience (Low → High)" },
  { value: "name_asc",    label: "Sort: Name (A → Z)"      },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build facet option arrays from a candidate list. */
function buildFacets(candidates) {
  const skillCount    = {};
  const locationCount = {};
  const statusCount   = {};

  candidates.forEach(({ skills, location, status }) => {
    skills.forEach((s) => { skillCount[s] = (skillCount[s] || 0) + 1; });
    locationCount[location] = (locationCount[location] || 0) + 1;
    statusCount[status]     = (statusCount[status]     || 0) + 1;
  });

  const toOptions = (map) =>
    Object.entries(map)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);

  return {
    skills:    toOptions(skillCount),
    locations: toOptions(locationCount),
    statuses:  toOptions(statusCount),
  };
}

/** Full-text match across name, bio, and skills. */
function matchesQuery(candidate, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    candidate.name.toLowerCase().includes(q) ||
    candidate.bio.toLowerCase().includes(q) ||
    candidate.location.toLowerCase().includes(q) ||
    candidate.skills.some((s) => s.toLowerCase().includes(q))
  );
}

/** Sort a candidate array. */
function sortCandidates(candidates, sortBy) {
  const copy = [...candidates];
  if (sortBy === "exp_desc") return copy.sort((a, b) => b.experience_years - a.experience_years);
  if (sortBy === "exp_asc")  return copy.sort((a, b) => a.experience_years - b.experience_years);
  if (sortBy === "name_asc") return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy; // "relevance" — keep original order
}

// ── Component ─────────────────────────────────────────────────────────────────

function SearchPage() {
  // Raw text input (updates on every keystroke)
  const [inputValue, setInputValue]       = useState("");
  // Debounced query used for actual filtering (waits 300 ms)
  const debouncedQuery                    = useDebounce(inputValue, 300);
  const [sortBy, setSortBy]               = useState("relevance");
  const [selectedSkills, setSelectedSkills]       = useState(new Set());
  const [selectedLocations, setSelectedLocations] = useState(new Set());
  const [selectedStatuses, setSelectedStatuses]   = useState(new Set());

  // ── Step 1: apply text search ──────────────────────────────────────────────
  // Facets are computed from this set so counts reflect the search query,
  // not the full dataset.
  const queryFiltered = useMemo(
    () => CANDIDATES.filter((c) => matchesQuery(c, debouncedQuery)),
    [debouncedQuery]
  );

  // ── Step 2: compute facet counts from query-filtered candidates ────────────
  const facets = useMemo(() => buildFacets(queryFiltered), [queryFiltered]);

  // ── Step 3: apply facet filters on top of text results ────────────────────
  const finalResults = useMemo(() => {
    let list = queryFiltered;

    if (selectedSkills.size > 0)
      list = list.filter((c) => c.skills.some((s) => selectedSkills.has(s)));

    if (selectedLocations.size > 0)
      list = list.filter((c) => selectedLocations.has(c.location));

    if (selectedStatuses.size > 0)
      list = list.filter((c) => selectedStatuses.has(c.status));

    return sortCandidates(list, sortBy);
  }, [queryFiltered, selectedSkills, selectedLocations, selectedStatuses, sortBy]);

  // ── Facet toggle helpers ───────────────────────────────────────────────────
  function toggleFacet(setter, value, checked) {
    setter((prev) => {
      const next = new Set(prev);
      checked ? next.add(value) : next.delete(value);
      return next;
    });
  }

  // ── Active filter tags (shown above results) ───────────────────────────────
  const activeFilters = [
    ...[...selectedSkills].map((v)    => ({ label: v, type: "skill"    })),
    ...[...selectedLocations].map((v) => ({ label: v, type: "location" })),
    ...[...selectedStatuses].map((v)  => ({ label: v, type: "status"   })),
  ];

  function removeFilter(type, value) {
    if (type === "skill")    toggleFacet(setSelectedSkills,    value, false);
    if (type === "location") toggleFacet(setSelectedLocations, value, false);
    if (type === "status")   toggleFacet(setSelectedStatuses,  value, false);
  }

  function clearAll() {
    setSelectedSkills(new Set());
    setSelectedLocations(new Set());
    setSelectedStatuses(new Set());
    setInputValue("");
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Page title */}
      <Title level={3} style={{ marginBottom: 4 }}>Candidate Search</Title>
      <Text type="secondary" style={{ fontSize: 13 }}>
        Search across {CANDIDATES.length} candidates — type to filter, use the sidebar to drill down.
      </Text>

      <Divider style={{ margin: "16px 0" }} />

      {/* ── Search bar + sort ── */}
      <Space style={{ width: "100%", marginBottom: 16 }} size={10}>
        {/*
          Input.Search — controlled input.
          We store the raw value in `inputValue` on every keystroke.
          The actual filtering uses `debouncedQuery` (300 ms delay).
        */}
        <Input
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          placeholder="Search by name, skill, location, or bio…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          allowClear
          style={{ width: 420 }}
          size="middle"
        />

        {/*
          Select — sort order.
          Changing this re-sorts without re-filtering.
        */}
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={SORT_OPTIONS}
          style={{ width: 240 }}
          size="middle"
        />
      </Space>

      {/* ── Active filter tags ── */}
      {activeFilters.length > 0 && (
        <Space wrap style={{ marginBottom: 14 }} size={6}>
          <Text type="secondary" style={{ fontSize: 12 }}>Active filters:</Text>
          {activeFilters.map(({ label, type }) => (
            <Tag
              key={`${type}-${label}`}
              closable
              onClose={() => removeFilter(type, label)}
              color={type === "skill" ? "purple" : type === "location" ? "blue" : "green"}
              style={{ fontSize: 12 }}
            >
              {label}
            </Tag>
          ))}
          <Tag
            icon={<CloseCircleOutlined />}
            onClick={clearAll}
            style={{ cursor: "pointer", fontSize: 12 }}
          >
            Clear all
          </Tag>
        </Space>
      )}

      {/* ── Main layout: facet sidebar + results ── */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

        {/* Facet sidebar */}
        <div style={{ flexShrink: 0, width: 220 }}>
          <FacetPanel
            facets={facets}
            selectedSkills={selectedSkills}
            selectedLocations={selectedLocations}
            selectedStatuses={selectedStatuses}
            onSkillChange={(v, c)    => toggleFacet(setSelectedSkills, v, c)}
            onLocationChange={(v, c) => toggleFacet(setSelectedLocations, v, c)}
            onStatusChange={(v, c)   => toggleFacet(setSelectedStatuses, v, c)}
            totalResults={finalResults.length}
          />
        </div>

        {/* Result cards */}
        <div style={{ flex: 1 }}>
          {finalResults.length === 0 ? (
            <Empty description="No candidates match your search" style={{ marginTop: 40 }} />
          ) : (
            finalResults.map((candidate) => (
              <ResultCard
                key={candidate.id}
                candidate={candidate}
                query={debouncedQuery}   // passed down for text highlighting
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default SearchPage;