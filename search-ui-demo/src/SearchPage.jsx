import { useState, useEffect, useCallback } from "react";
import {
  Input, Select, Space, Typography, Tag, Empty,
  Divider, Button, notification,
} from "antd";
import { SearchOutlined, CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";

import useDebounce from "./hooks/useDebounce";
import FacetPanel from "./components/FacetPanel";
import CandidatesGrid from "./components/CandidatesGrid";
import AddCandidateModal from "./components/AddCandidateModal";

const { Title, Text } = Typography;

const SORT_OPTIONS = [
  { value: "relevance", label: "Sort: Relevance"              },
  { value: "exp_desc",  label: "Sort: Experience (High → Low)" },
  { value: "exp_asc",   label: "Sort: Experience (Low → High)" },
  { value: "name_asc",  label: "Sort: Name (A → Z)"           },
];

function SearchPage() {
  // ── Search & sort state ────────────────────────────────────────────────────
  const [inputValue, setInputValue] = useState("");
  const debouncedQuery              = useDebounce(inputValue, 300);
  const [sortBy, setSortBy]         = useState("relevance");

  // ── Facet filter state ─────────────────────────────────────────────────────
  const [selectedSkills,    setSelectedSkills]    = useState(new Set());
  const [selectedLocations, setSelectedLocations] = useState(new Set());
  const [selectedStatuses,  setSelectedStatuses]  = useState(new Set());

  // ── API response state ─────────────────────────────────────────────────────
  const [results, setResults] = useState([]);
  const [facets,  setFacets]  = useState({ skills: [], locations: [], statuses: [] });
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);

  // ── Fetch from API ─────────────────────────────────────────────────────────
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery)          params.set("q",         debouncedQuery);
      if (selectedSkills.size)     params.set("skills",    [...selectedSkills].join(","));
      if (selectedLocations.size)  params.set("locations", [...selectedLocations].join(","));
      if (selectedStatuses.size)   params.set("statuses",  [...selectedStatuses].join(","));
      params.set("sort", sortBy);

      const res  = await fetch(`/api/candidates?${params.toString()}`);
      const data = await res.json();

      setResults(data.results  ?? []);
      setFacets(data.facets    ?? { skills: [], locations: [], statuses: [] });
      setTotal(data.total      ?? 0);
    } catch (err) {
      notification.error({ message: "Could not reach the server", description: "Make sure the search-ui-demo server is running on port 3001." });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedSkills, selectedLocations, selectedStatuses, sortBy]);

  // Re-fetch whenever query/filters/sort change
  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  // ── Facet toggle ───────────────────────────────────────────────────────────
  function toggleFacet(setter, value, checked) {
    setter((prev) => {
      const next = new Set(prev);
      checked ? next.add(value) : next.delete(value);
      return next;
    });
  }

  // ── Active filter tags ─────────────────────────────────────────────────────
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

  // Called when Add Candidate modal succeeds
  function handleCandidateCreated() {
    setModalOpen(false);
    notification.success({ message: "Candidate added!", description: "The candidate has been saved to MongoDB." });
    fetchCandidates(); // refresh the list
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <Title level={3} style={{ marginBottom: 2 }}>Candidate Search</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Live search with MongoDB — use filters to drill down.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Add Candidate
        </Button>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* Search + sort */}
      <Space style={{ width: "100%", marginBottom: 16 }} size={10}>
        <Input
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          placeholder="Search by name, skill, location, bio…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          allowClear
          style={{ width: 420 }}
        />
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={SORT_OPTIONS}
          style={{ width: 240 }}
        />
      </Space>

      {/* Active filter tags */}
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
          <Tag icon={<CloseCircleOutlined />} onClick={clearAll} style={{ cursor: "pointer", fontSize: 12 }}>
            Clear all
          </Tag>
        </Space>
      )}

      {/* Facet sidebar + results */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

        <div style={{ flexShrink: 0, width: 220 }}>
          <FacetPanel
            facets={facets}
            selectedSkills={selectedSkills}
            selectedLocations={selectedLocations}
            selectedStatuses={selectedStatuses}
            onSkillChange={(v, c)    => toggleFacet(setSelectedSkills,    v, c)}
            onLocationChange={(v, c) => toggleFacet(setSelectedLocations, v, c)}
            onStatusChange={(v, c)   => toggleFacet(setSelectedStatuses,  v, c)}
            totalResults={total}
          />
        </div>

        <div style={{ flex: 1 }}>
          {!loading && results.length === 0 ? (
            <Empty
              description={
                total === 0 && !inputValue && activeFilters.length === 0
                  ? "No candidates yet — click Add Candidate to get started"
                  : "No candidates match your search"
              }
              style={{ marginTop: 40 }}
            />
          ) : (
            <CandidatesGrid
              rows={results}
              query={debouncedQuery}
              loading={loading}
            />
          )}
        </div>

      </div>

      {/* Add Candidate Modal */}
      <AddCandidateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCandidateCreated}
      />
    </div>
  );
}

export default SearchPage;