import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.png';

const API_BASE = 'http://localhost:5000/api';

const INITIAL_SURVEY_STATE = {
  headOfHousehold: '',
  contactNumber: '',
  totalFamilyMembers: 1,
  childrenUnder18: 0,
  casteCategory: 'General',
  highestEducation: 'Primary',
  schoolGoingChildren: 'Yes',
  accessToHealthcare: 'Primary Health Centre (PHC)',
  chronicIllnessInFamily: 'No',
  primaryIncomeSource: 'Agriculture / Farming',
  employmentStatus: 'Self-Employed',
  monthlyFamilyIncome: 'Below ₹10,000',
  rationCardType: 'BPL',
  bankAccountAndUPI: 'Yes',
  housingType: 'Kutcha',
  waterSource: 'Community Tap',
  sanitationFacility: 'Household Toilet',
  electricityAccess: 'Grid Connected',
  cookingFuelType: 'LPG Cylinder',
  roadConnectivity: 'Paved / Tar Road',
  ownsAgriculturalLand: 'No',
  landAreaInAcres: '0',
  irrigationSource: 'Rain-fed',
  livestockOwned: 'None',
  availedGovtSchemes: 'PM-KISAN',
  villagerUsername: '',
  villagerPassword: '',
  isSubmitted: false
};

function parseHistorySafe(rawHistory) {
  let value = rawHistory;
  for (let i = 0; i < 4; i++) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return [];
      try {
        value = JSON.parse(trimmed);
      } catch {
        return [];
      }
    } else {
      return [];
    }
  }
  return Array.isArray(value) ? value : [];
}

const PasswordField = ({ value, onChange, placeholder, style, required = true }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{ ...style, paddingRight: '42px' }}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        title={visible ? 'Hide Password' : 'Show Password'}
        style={{
          position: 'absolute', right: '10px', top: '42%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
        }}
      >
        {visible ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
        )}
      </button>
    </div>
  );
};

const SurveyFormSections = ({ data, setData, ui, theme, readOnly = false }) => {
  const sectionStyle = {
    backgroundColor: theme.cardSubtle, border: `1px solid ${theme.border}`,
    borderRadius: '10px', padding: '18px', marginBottom: '18px'
  };
  const sectionHeaderStyle = {
    margin: '0 0 14px 0', fontSize: '15px', fontWeight: '700', color: theme.primary,
    borderBottom: `1px solid ${theme.border}`, paddingBottom: '8px'
  };
  const gridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px'
  };
  const inputStyle = {
    ...ui.input,
    opacity: readOnly ? 0.85 : 1,
    cursor: readOnly ? 'default' : 'auto'
  };
  const handleChange = (field, val) => {
    if (!readOnly && setData) setData({ ...data, [field]: val });
  };

  return (
    <div>
      <div style={sectionStyle}>
        <h4 style={sectionHeaderStyle}>1. Demographics & Household Profile</h4>
        <div style={gridStyle}>
          <div>
            <label style={ui.label}>Head of Household *</label>
            <input disabled={readOnly} type="text" placeholder="Full Name" style={inputStyle} value={data.headOfHousehold || ''} onChange={e => handleChange('headOfHousehold', e.target.value)} required />
          </div>
          <div>
            <label style={ui.label}>Contact Number</label>
            <input disabled={readOnly} type="text" placeholder="10-digit Mobile" style={inputStyle} value={data.contactNumber || ''} onChange={e => handleChange('contactNumber', e.target.value)} />
          </div>
          <div>
            <label style={ui.label}>Total Family Members</label>
            <input disabled={readOnly} type="number" min="1" style={inputStyle} value={data.totalFamilyMembers ?? 1} onChange={e => handleChange('totalFamilyMembers', parseInt(e.target.value, 10) || 1)} />
          </div>
          <div>
            <label style={ui.label}>Children Under 18</label>
            <input disabled={readOnly} type="number" min="0" style={inputStyle} value={data.childrenUnder18 ?? 0} onChange={e => handleChange('childrenUnder18', parseInt(e.target.value, 10) || 0)} />
          </div>
          <div>
            <label style={ui.label}>Social / Caste Category</label>
            <select disabled={readOnly} style={inputStyle} value={data.casteCategory || 'General'} onChange={e => handleChange('casteCategory', e.target.value)}>
              <option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option>
            </select>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h4 style={sectionHeaderStyle}>2. Education & Healthcare</h4>
        <div style={gridStyle}>
          <div>
            <label style={ui.label}>Highest Education in Family</label>
            <select disabled={readOnly} style={inputStyle} value={data.highestEducation || 'Primary'} onChange={e => handleChange('highestEducation', e.target.value)}>
              <option value="No Formal Education">No Formal Education</option><option value="Primary">Primary School (1-5)</option><option value="Secondary">Secondary / High School (6-10)</option><option value="Higher Secondary">PUC / Higher Secondary (11-12)</option><option value="Graduate & Above">Graduate / Diploma & Above</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Children Attending School</label>
            <select disabled={readOnly} style={inputStyle} value={data.schoolGoingChildren || 'Yes'} onChange={e => handleChange('schoolGoingChildren', e.target.value)}>
              <option value="Yes">Yes (All Enrolled)</option><option value="Partially">Partially Enrolled</option><option value="No">No / Dropped Out</option><option value="N/A">N/A (No Children)</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Primary Healthcare Access</label>
            <select disabled={readOnly} style={inputStyle} value={data.accessToHealthcare || 'Primary Health Centre (PHC)'} onChange={e => handleChange('accessToHealthcare', e.target.value)}>
              <option value="Primary Health Centre (PHC)">Primary Health Centre (PHC)</option><option value="Government Hospital">Taluk / District Govt Hospital</option><option value="Private Clinic / Hospital">Private Clinic / Hospital</option><option value="No Nearby Facility">No Nearby Medical Facility</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Chronic Illness in Family</label>
            <select disabled={readOnly} style={inputStyle} value={data.chronicIllnessInFamily || 'No'} onChange={e => handleChange('chronicIllnessInFamily', e.target.value)}>
              <option value="No">No</option><option value="Yes">Yes (Requires Regular Care)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h4 style={sectionHeaderStyle}>3. Employment, Livelihood & Socio-Economic Indicators</h4>
        <div style={gridStyle}>
          <div>
            <label style={ui.label}>Primary Livelihood / Income Source</label>
            <select disabled={readOnly} style={inputStyle} value={data.primaryIncomeSource || 'Agriculture / Farming'} onChange={e => handleChange('primaryIncomeSource', e.target.value)}>
              <option value="Agriculture / Farming">Agriculture / Farming</option><option value="Agricultural / Daily Wage Labour">Daily Wage / MGNREGA Labour</option><option value="Animal Husbandry / Dairy">Animal Husbandry / Dairy</option><option value="Small Shop / Rural Business">Small Shop / Rural Business</option><option value="Salaried (Govt / Private)">Salaried (Govt / Private)</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Employment Status</label>
            <select disabled={readOnly} style={inputStyle} value={data.employmentStatus || 'Self-Employed'} onChange={e => handleChange('employmentStatus', e.target.value)}>
              <option value="Self-Employed">Self-Employed</option><option value="Regular Wage / Salaried">Regular Wage / Salaried</option><option value="Seasonal / Casual Worker">Seasonal / Casual Worker</option><option value="Unemployed">Unemployed</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Monthly Household Income</label>
            <select disabled={readOnly} style={inputStyle} value={data.monthlyFamilyIncome || 'Below ₹10,000'} onChange={e => handleChange('monthlyFamilyIncome', e.target.value)}>
              <option value="Below ₹5,000">Below ₹5,000</option><option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option><option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option><option value="Above ₹25,000">Above ₹25,000</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Ration Card Category</label>
            <select disabled={readOnly} style={inputStyle} value={data.rationCardType || 'BPL'} onChange={e => handleChange('rationCardType', e.target.value)}>
              <option value="BPL">BPL (Priority Household)</option><option value="Antyodaya (AAY)">Antyodaya Anna Yojana (AAY)</option><option value="APL">APL (Non-Priority)</option><option value="None">No Ration Card</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Bank Account & UPI Access</label>
            <select disabled={readOnly} style={inputStyle} value={data.bankAccountAndUPI || 'Yes'} onChange={e => handleChange('bankAccountAndUPI', e.target.value)}>
              <option value="Yes">Yes (Bank + UPI Active)</option><option value="Bank Account Only">Bank Account Only (No UPI)</option><option value="No">Unbanked (No Account)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h4 style={sectionHeaderStyle}>4. Housing, Water, Sanitation & Infrastructure</h4>
        <div style={gridStyle}>
          <div>
            <label style={ui.label}>Housing Structure Type</label>
            <select disabled={readOnly} style={inputStyle} value={data.housingType || 'Kutcha'} onChange={e => handleChange('housingType', e.target.value)}>
              <option value="Kutcha">Kutcha (Mud / Thatch)</option><option value="Semi-Pucca">Semi-Pucca</option><option value="Pucca">Pucca (Concrete / Brick)</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Drinking Water Source</label>
            <select disabled={readOnly} style={inputStyle} value={data.waterSource || 'Community Tap'} onChange={e => handleChange('waterSource', e.target.value)}>
              <option value="Piped Household Tap (Jal Jeevan)">Piped Household Tap</option><option value="Community Tap / Handpump">Community Tap / Handpump</option><option value="Borewell">Borewell</option><option value="Open Well / Tanker">Open Well / Tanker</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Sanitation / Toilet Facility</label>
            <select disabled={readOnly} style={inputStyle} value={data.sanitationFacility || 'Household Toilet'} onChange={e => handleChange('sanitationFacility', e.target.value)}>
              <option value="Household Toilet">Individual Household Toilet</option><option value="Community Toilet">Shared / Community Toilet</option><option value="No Toilet">No Toilet / Open Defecation</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Electricity Access</label>
            <select disabled={readOnly} style={inputStyle} value={data.electricityAccess || 'Grid Connected'} onChange={e => handleChange('electricityAccess', e.target.value)}>
              <option value="Grid Connected">Grid Connected (Regular)</option><option value="Solar / Off-Grid">Solar / Micro-Grid</option><option value="No Electricity">No Electricity</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Primary Cooking Fuel</label>
            <select disabled={readOnly} style={inputStyle} value={data.cookingFuelType || 'LPG Cylinder'} onChange={e => handleChange('cookingFuelType', e.target.value)}>
              <option value="LPG Cylinder">LPG Cylinder (Ujjwala / Regular)</option><option value="Firewood / Crop Residue">Firewood / Biomass</option><option value="Biogas / Electric">Biogas / Electric Induction</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>All-Weather Road Connectivity</label>
            <select disabled={readOnly} style={inputStyle} value={data.roadConnectivity || 'Paved / Tar Road'} onChange={e => handleChange('roadConnectivity', e.target.value)}>
              <option value="Paved / Tar Road">Paved / Concrete / Tar Road</option><option value="Gravel Road">Gravel / Semi-Paved Road</option><option value="Mud / Kuccha Path">Unpaved Mud Path</option>
            </select>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h4 style={sectionHeaderStyle}>5. Agriculture & Government Welfare Schemes</h4>
        <div style={gridStyle}>
          <div>
            <label style={ui.label}>Owns Agricultural Land?</label>
            <select disabled={readOnly} style={inputStyle} value={data.ownsAgriculturalLand || 'No'} onChange={e => handleChange('ownsAgriculturalLand', e.target.value)}>
              <option value="No">No (Landless)</option><option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Cultivable Land Area (Acres)</label>
            <input disabled={readOnly} type="text" placeholder="e.g., 2.5" style={inputStyle} value={data.landAreaInAcres || '0'} onChange={e => handleChange('landAreaInAcres', e.target.value)} />
          </div>
          <div>
            <label style={ui.label}>Primary Irrigation Source</label>
            <select disabled={readOnly} style={inputStyle} value={data.irrigationSource || 'Rain-fed'} onChange={e => handleChange('irrigationSource', e.target.value)}>
              <option value="Rain-fed">Rain-fed Only</option><option value="Borewell / Drip">Borewell / Drip Irrigation</option><option value="Canal / River">Canal / Tank Irrigation</option><option value="N/A">N/A (No Farming)</option>
            </select>
          </div>
          <div>
            <label style={ui.label}>Livestock Owned</label>
            <select disabled={readOnly} style={inputStyle} value={data.livestockOwned || 'None'} onChange={e => handleChange('livestockOwned', e.target.value)}>
              <option value="None">None</option><option value="Dairy Cattle / Buffaloes">Dairy Cattle / Buffaloes</option><option value="Goats / Sheep">Goats / Sheep</option><option value="Poultry">Poultry</option>
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={ui.label}>Government Welfare Schemes Availed</label>
            <input disabled={readOnly} type="text" placeholder="e.g., PM-KISAN, Ayushman Bharat" style={inputStyle} value={data.availedGovtSchemes || ''} onChange={e => handleChange('availedGovtSchemes', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('vd_theme') === 'dark');
  useEffect(() => { localStorage.setItem('vd_theme', darkMode ? 'dark' : 'light'); }, [darkMode]);

  const [activeStaff, setActiveStaff] = useState(() => sessionStorage.getItem('vd_staff') || null);
  const [activeStaffUsername, setActiveStaffUsername] = useState(() => sessionStorage.getItem('vd_staff_user') || '');
  const [view, setView] = useState(() =>
    sessionStorage.getItem('vd_staff') ? (sessionStorage.getItem('vd_view') || 'DASHBOARD') : 'STAFF_LOGIN'
  );
  const [activeVillager, setActiveVillager] = useState(null);

  useEffect(() => {
    localStorage.removeItem('vd_view');
    localStorage.removeItem('vd_staff');
    localStorage.removeItem('vd_staff_user');
  }, []);

  const [surveys, setSurveys] = useState([]);
  const [loginRoleTab, setLoginRoleTab] = useState('Officer');
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState(INITIAL_SURVEY_STATE);

  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: true, message: '' });

  const [inboxOpen, setInboxOpen] = useState(false);
  const [inboxTab, setInboxTab] = useState('ACTIVE');
  const [requestModalSurvey, setRequestModalSurvey] = useState(null);
  const [requestReasonText, setRequestReasonText] = useState('');
  const [rejectingSurvey, setRejectingSurvey] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [viewingSurvey, setViewingSurvey] = useState(null);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get(`${API_BASE}/surveys`);
      setSurveys(response.data);
    } catch (error) { console.error('Database sync error:', error); }
  };

  useEffect(() => {
    if (view === 'DASHBOARD' || view === 'VILLAGER_VIEW' || view === 'VILLAGER_LOGIN') {
      fetchSurveys();
      const interval = setInterval(fetchSurveys, 3000);
      return () => clearInterval(interval);
    }
  }, [view]);

  useEffect(() => {
    const uname = formData.villagerUsername.trim();
    if (!uname) { setUsernameStatus({ checking: false, available: true, message: '' }); return; }

    const localDuplicate = surveys.some(s => s.villagerUsername?.toLowerCase() === uname.toLowerCase());
    if (localDuplicate) {
      setUsernameStatus({ checking: false, available: false, message: 'Username is already taken by another villager.' });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setUsernameStatus(prev => ({ ...prev, checking: true }));
        const res = await axios.get(`${API_BASE}/surveys/check-username/${encodeURIComponent(uname)}`);
        setUsernameStatus({ checking: false, available: res.data.available, message: res.data.message });
      } catch { setUsernameStatus({ checking: false, available: true, message: '' }); }
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.villagerUsername, surveys]);

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/login`, {
        username: creds.username,
        password: creds.password,
        role: loginRoleTab
      });
      if (response.data.success) {
        setActiveStaff(loginRoleTab);
        setActiveStaffUsername(creds.username);
        setView('DASHBOARD');
        sessionStorage.setItem('vd_staff', loginRoleTab);
        sessionStorage.setItem('vd_staff_user', creds.username);
        sessionStorage.setItem('vd_view', 'DASHBOARD');
        setErrorMsg('');
        setCreds({ username: '', password: '' });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.reason) {
        setErrorMsg(err.response.data.reason);
      } else {
        setErrorMsg(`Incorrect username or password for ${loginRoleTab}.`);
      }
    }
  };

  const handleLogout = () => {
    setActiveStaff(null);
    setActiveStaffUsername('');
    setActiveVillager(null);
    setCreds({ username: '', password: '' });
    setErrorMsg('');
    setView('STAFF_LOGIN');
    sessionStorage.removeItem('vd_staff');
    sessionStorage.removeItem('vd_staff_user');
    sessionStorage.removeItem('vd_view');
  };

  const handleVillagerLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API_BASE}/surveys`);
      const latestSurveys = response.data;
      setSurveys(latestSurveys);

      const userMatch = latestSurveys.find(s => s.villagerUsername === creds.username);
      if (!userMatch) {
        setErrorMsg('Incorrect username.');
        return;
      }

      if (userMatch.villagerPassword !== creds.password) {
        setErrorMsg('Incorrect password.');
        return;
      }

      if (userMatch.isSubmitted) {
        setErrorMsg('Form already submitted. To make changes, send a request to the admin stating which field needs to be edited.');
        return;
      }

      setActiveVillager({ ...userMatch });
      setView('VILLAGER_VIEW');
      setErrorMsg('');
      setCreds({ username: '', password: '' });
    } catch {
      setErrorMsg('Unable to verify credentials right now.');
    }
  };

  const handleVillagerDataSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/surveys/${activeVillager.id}`, {
        ...activeVillager,
        isSubmitted: true
      });
      alert('Villager household development survey submitted successfully!');
      setActiveVillager(null);
      setView('DASHBOARD');
      fetchSurveys();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit villager survey data.');
    }
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    if (!usernameStatus.available) { alert('Please choose a unique villager username before submitting.'); return; }
    try {
      await axios.post(`${API_BASE}/surveys`, {
        ...formData,
        isSubmitted: false,
        editRequested: false,
        editRequestStatus: 'None'
      });
      alert('Household Account Created! Click "Villager Portal" in the top bar and log in with this villager\'s credentials to fill out the survey.');
      setFormData(INITIAL_SURVEY_STATE);
      fetchSurveys();
    } catch (error) { alert(error.response?.data?.error || 'Error saving to database.'); }
  };

  const handleOfficerRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestReasonText.trim()) return;
    try {
      await axios.post(`${API_BASE}/surveys/${requestModalSurvey.id}/request-edit`, {
        officerName: activeStaffUsername || 'Field Officer',
        reason: requestReasonText.trim()
      });
      setRequestModalSurvey(null);
      setRequestReasonText('');
      fetchSurveys();
      alert('Edit request submitted to Admin Inbox!');
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error submitting edit request.');
    }
  };

  const handleAdminAcceptAndEdit = (survey) => {
    setInboxOpen(false);
    setEditingSurvey({ ...survey, _fromInboxAccept: true });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      if (editingSurvey.editRequested || editingSurvey._fromInboxAccept) {
        await axios.post(`${API_BASE}/surveys/${editingSurvey.id}/resolve-request`, {
          status: 'Accepted',
          adminRemarks: 'Approved and updated by Admin.',
          updatedFields: editingSurvey
        });
      } else {
        await axios.put(`${API_BASE}/surveys/${editingSurvey.id}`, editingSurvey);
      }
      setEditingSurvey(null);
      fetchSurveys();
      alert('Survey record updated!');
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error updating survey.');
    }
  };

  const handleAdminRejectConfirm = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/surveys/${rejectingSurvey.id}/resolve-request`, {
        status: 'Rejected',
        adminRemarks: rejectionReasonText.trim() || 'Request declined by Admin.'
      });
      setRejectingSurvey(null);
      setRejectionReasonText('');
      fetchSurveys();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error rejecting request.');
    }
  };

  const pendingRequests = surveys.filter(s => s.editRequestStatus === 'Pending');
  const officerActiveRequests = surveys.filter(s => s.editRequestStatus === 'Pending');

  const allHistoryLogs = surveys
    .flatMap(s => parseHistorySafe(s.requestHistory))
    .sort((a, b) => new Date(b.resolvedAt) - new Date(a.resolvedAt));

  const badgeCount = activeStaff === 'Admin' ? pendingRequests.length : officerActiveRequests.length;

  const theme = {
    bg: darkMode ? '#0f172a' : '#f1f5f9', card: darkMode ? '#1e293b' : '#ffffff',
    cardSubtle: darkMode ? '#0f172a' : '#f8fafc', text: darkMode ? '#f8fafc' : '#0f172a',
    textMuted: darkMode ? '#94a3b8' : '#64748b', border: darkMode ? '#334155' : '#e2e8f0',
    inputBg: darkMode ? '#0f172a' : '#ffffff', primary: '#2563eb', success: '#10b981',
    warning: '#f59e0b', danger: '#ef4444'
  };

  const ui = {
    page: { backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: 'all 0.25s' },
    navbar: { backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
    container: { maxWidth: '1140px', margin: '32px auto', padding: '0 20px' },
    card: { backgroundColor: theme.card, borderRadius: '14px', border: `1px solid ${theme.border}`, padding: '28px', marginBottom: '24px', boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.35)' : '0 4px 16px rgba(15,23,42,0.05)' },
    authCard: { maxWidth: '430px', margin: '60px auto', backgroundColor: theme.card, borderRadius: '16px', border: `1px solid ${theme.border}`, padding: '36px 32px' },
    input: { width: '100%', padding: '10px 12px', marginTop: '5px', marginBottom: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.text, fontSize: '13.5px', boxSizing: 'border-box', outline: 'none' },
    label: { fontSize: '12.5px', fontWeight: '600', color: theme.textMuted, display: 'block' },
    btnPrimary: { padding: '11px 18px', backgroundColor: theme.primary, color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
    btnIcon: { backgroundColor: theme.cardSubtle, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '9px 13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '13px' },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
    modalBox: { backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '16px', width: '100%', maxWidth: '860px', maxHeight: '88vh', overflowY: 'auto', padding: '28px' },
    statusChip: (status) => {
      const colors = { Pending: { bg: '#fef3c7', text: '#b45309' }, Accepted: { bg: '#d1fae5', text: '#047857' }, Rejected: { bg: '#fee2e2', text: '#b91c1c' }, None: { bg: theme.border, text: theme.textMuted } };
      const c = colors[status] || colors.None;
      return { backgroundColor: c.bg, color: c.text, padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', display: 'inline-block' };
    }
  };

  const renderTopNav = () => (
    <header style={ui.navbar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <img src={logo} alt="VD Foundation" style={{ height: '42px', borderRadius: '6px' }} />
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>VD Foundation</h1>
          {activeStaff && <span style={{ fontSize: '12px', color: theme.textMuted }}>Logged in as <strong>{activeStaff}</strong></span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => setDarkMode(!darkMode)} style={ui.btnIcon}>{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</button>
        {view === 'DASHBOARD' && activeStaff && (
          <button onClick={() => setInboxOpen(true)} style={ui.btnIcon}>
            <span>📬 Inbox</span>
            {badgeCount > 0 && <span style={{ backgroundColor: theme.danger, color: '#fff', borderRadius: '999px', padding: '2px 7px', fontSize: '11px' }}>{badgeCount}</span>}
          </button>
        )}
        {view === 'DASHBOARD' && activeStaff && (
          <>
            <button
              onClick={() => {
                setErrorMsg('');
                setCreds({ username: '', password: '' });
                setView('VILLAGER_LOGIN');
              }}
              style={{ ...ui.btnPrimary, backgroundColor: theme.success }}
            >
              Villager Portal
            </button>
            <button onClick={handleLogout} style={{ ...ui.btnPrimary, backgroundColor: theme.danger }}>Lock System</button>
          </>
        )}
      </div>
    </header>
  );

  if (view === 'STAFF_LOGIN' || !activeStaff) {
    return (
      <div style={ui.page}>{renderTopNav()}
        <div style={ui.authCard}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 6px', fontSize: '22px' }}>Staff Portal Login</h2>
            <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted }}>Select your role to unlock the village system</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: theme.cardSubtle, padding: '4px', borderRadius: '10px', marginBottom: '22px', border: `1px solid ${theme.border}` }}>
            {['Admin', 'Officer'].map(role => (
              <button key={role} type="button" onClick={() => { setLoginRoleTab(role); setErrorMsg(''); }} style={{ padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: loginRoleTab === role ? theme.primary : 'transparent', color: loginRoleTab === role ? '#ffffff' : theme.textMuted }}>{role === 'Officer' ? 'Field Officer' : 'Admin'}</button>
            ))}
          </div>
          {errorMsg && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>{errorMsg}</div>}
          <form onSubmit={handleStaffLogin}>
            <label style={ui.label}>Username</label>
            <input type="text" placeholder={`Enter ${loginRoleTab} username`} style={ui.input} value={creds.username} onChange={e => setCreds({ ...creds, username: e.target.value })} required />
            <label style={ui.label}>Password</label>
            <PasswordField placeholder="Enter password" style={ui.input} value={creds.password} onChange={e => setCreds({ ...creds, password: e.target.value })} />
            <button type="submit" style={{ ...ui.btnPrimary, width: '100%', marginTop: '8px', padding: '13px' }}>Unlock {loginRoleTab} Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'VILLAGER_LOGIN') {
    return (
      <div style={ui.page}>{renderTopNav()}
        <div style={ui.authCard}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '8px 0 4px' }}>Villager Portal Login</h2>
            <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted }}>
              Enter the villager's assigned credentials to fill out and submit their household survey form.
            </p>
          </div>
          {errorMsg && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: '600', lineHeight: '1.5' }}>
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleVillagerLogin}>
            <label style={ui.label}>Villager Username</label>
            <input type="text" placeholder="Enter unique username" style={ui.input} value={creds.username} onChange={e => setCreds({ ...creds, username: e.target.value })} required />
            <label style={ui.label}>Password</label>
            <PasswordField placeholder="Enter password" style={ui.input} value={creds.password} onChange={e => setCreds({ ...creds, password: e.target.value })} />
            <button type="submit" style={{ ...ui.btnPrimary, width: '100%', marginBottom: '10px' }}>Login to Fill Survey Form</button>
            <button type="button" onClick={() => { setErrorMsg(''); setView('DASHBOARD'); }} style={{ ...ui.btnIcon, width: '100%', justifyContent: 'center' }}>Return to Staff Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'VILLAGER_VIEW' && activeVillager) {
    return (
      <div style={ui.page}>{renderTopNav()}
        <div style={ui.container}>
          <div style={ui.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={ui.statusChip('Pending')}>Villager Data Entry Portal (One-Time Submission)</span>
                <h2 style={{ margin: '8px 0 2px' }}>Household Development Survey: {activeVillager.headOfHousehold}</h2>
                <span style={{ fontSize: '13px', color: theme.textMuted }}>Villager Username: <strong>@{activeVillager.villagerUsername}</strong></span>
              </div>
              <button onClick={() => { setActiveVillager(null); setView('DASHBOARD'); }} style={{ ...ui.btnPrimary, backgroundColor: theme.danger }}>Cancel & Exit</button>
            </div>

            <form onSubmit={handleVillagerDataSave}>
              <SurveyFormSections data={activeVillager} setData={setActiveVillager} ui={ui} theme={theme} />
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" style={{ ...ui.btnPrimary, backgroundColor: theme.success }}>
                  ✓ Submit Final Household Survey Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={ui.page}>{renderTopNav()}
      <div style={ui.container}>

        <div style={ui.card}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px' }}>Register New Villager Household</h2>
            <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted }}>
              Create an account so the villager can log in via the <strong>Villager Portal</strong> to fill out and submit their development survey.
            </p>
          </div>
          <form onSubmit={handleSurveySubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={ui.label}>Head of Household (Primary Contact) *</label>
                <input type="text" placeholder="e.g., Ramesh Kumar" style={ui.input} value={formData.headOfHousehold} onChange={e => setFormData({ ...formData, headOfHousehold: e.target.value })} required />
              </div>
              <div>
                <label style={ui.label}>Assign Unique Villager Username *</label>
                <input type="text" placeholder="e.g., ramesh_k" style={{ ...ui.input, borderColor: !usernameStatus.available ? theme.danger : theme.border }} value={formData.villagerUsername} onChange={e => setFormData({ ...formData, villagerUsername: e.target.value })} required />
                {formData.villagerUsername && (
                  <div style={{ fontSize: '12px', fontWeight: '600', color: usernameStatus.available ? theme.success : theme.danger, marginTop: '-6px' }}>
                    {usernameStatus.checking ? 'Checking availability...' : usernameStatus.available ? '✓ Username available' : `✕ ${usernameStatus.message}`}
                  </div>
                )}
              </div>
              <div>
                <label style={ui.label}>Assign Password *</label>
                <PasswordField placeholder="Create villager password" style={ui.input} value={formData.villagerPassword} onChange={e => setFormData({ ...formData, villagerPassword: e.target.value })} />
              </div>
            </div>
            <button type="submit" disabled={!usernameStatus.available || !formData.headOfHousehold} style={{ ...ui.btnPrimary, opacity: (!usernameStatus.available || !formData.headOfHousehold) ? 0.5 : 1 }}>
              + Register Household Account
            </button>
          </form>
        </div>

        <div style={ui.card}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px' }}>Collected Household Surveys ({surveys.length})</h2>
          </div>
          {surveys.length === 0 ? <p style={{ color: theme.textMuted, textAlign: 'center', padding: '24px' }}>No household surveys recorded yet.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {surveys.map(survey => (
                <div key={survey.id} style={{ backgroundColor: theme.cardSubtle, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '18px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: '1 1 520px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '700', fontSize: '16px' }}>#{survey.id} — {survey.headOfHousehold}</span>
                      <span style={ui.statusChip(survey.isSubmitted ? 'Accepted' : 'Pending')}>
                        {survey.isSubmitted ? 'Form Submitted' : 'Awaiting Villager Submission'}
                      </span>
                      {survey.isSubmitted && <span style={ui.statusChip('Accepted')}>{survey.rationCardType || 'BPL'}</span>}
                      {survey.editRequestStatus && survey.editRequestStatus !== 'None' && <span style={ui.statusChip(survey.editRequestStatus)}>Edit Request: {survey.editRequestStatus}</span>}
                    </div>
                    <div style={{ fontSize: '12.5px', color: theme.textMuted, marginTop: '8px', lineHeight: '1.7' }}>
                      <strong>Demographics:</strong> {survey.totalFamilyMembers || 1} Members ({survey.casteCategory || 'General'}) • <strong>Livelihood:</strong> {survey.primaryIncomeSource || 'Agriculture'} <br />
                      <strong>Housing & Infra:</strong> {survey.housingType} | Water: {survey.waterSource} | Power: {survey.electricityAccess || 'Grid'} • <strong>Portal Login:</strong> @{survey.villagerUsername}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setViewingSurvey(survey)}
                      style={{
                        ...ui.btnIcon,
                        backgroundColor: darkMode ? '#1e3a8a' : '#dbeafe',
                        color: darkMode ? '#93c5fd' : '#1d4ed8',
                        borderColor: 'transparent'
                      }}
                    >
                      👁️ View Survey Form
                    </button>
                    {activeStaff === 'Admin' ? (
                      <button onClick={() => setEditingSurvey({ ...survey })} style={{ ...ui.btnPrimary, backgroundColor: theme.warning, color: '#0f172a' }}>✏️ Edit Record</button>
                    ) : survey.editRequestStatus === 'Pending' ? (
                      <span style={{ fontSize: '13px', color: theme.warning, fontWeight: '700', padding: '0 8px' }}>⏳ Pending Admin Review</span>
                    ) : (
                      <button onClick={() => { setRequestModalSurvey(survey); setRequestReasonText(''); }} style={ui.btnIcon}>📝 Request Edit</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {viewingSurvey && (
        <div style={ui.modalOverlay} onClick={() => setViewingSurvey(null)}>
          <div style={ui.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>
                    Household Survey Form — #{viewingSurvey.id} ({viewingSurvey.headOfHousehold})
                  </h3>
                  <span style={ui.statusChip(viewingSurvey.isSubmitted ? 'Accepted' : 'Pending')}>
                    {viewingSurvey.isSubmitted ? 'Submitted' : 'Not Yet Submitted by Villager'}
                  </span>
                </div>
                <span style={{ fontSize: '12.5px', color: theme.textMuted }}>
                  Villager Username: <strong>@{viewingSurvey.villagerUsername}</strong> (Read-Only View)
                </span>
              </div>
              <button onClick={() => setViewingSurvey(null)} style={ui.btnIcon}>✕ Close</button>
            </div>

            {!viewingSurvey.isSubmitted && (
              <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>
                This villager has not logged into the Villager Portal to submit their form yet. Showing default placeholder values below.
              </div>
            )}

            <SurveyFormSections data={viewingSurvey} ui={ui} theme={theme} readOnly={true} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button onClick={() => setViewingSurvey(null)} style={ui.btnPrimary}>Close View</button>
            </div>
          </div>
        </div>
      )}

      {inboxOpen && (
        <div style={ui.modalOverlay} onClick={() => setInboxOpen(false)}>
          <div style={ui.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>📬 {activeStaff} Notification Inbox</h3>
              <button onClick={() => setInboxOpen(false)} style={ui.btnIcon}>✕ Close</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '12px', marginBottom: '18px' }}>
              <button onClick={() => setInboxTab('ACTIVE')} style={{ ...ui.btnPrimary, backgroundColor: inboxTab === 'ACTIVE' ? theme.primary : theme.cardSubtle, color: inboxTab === 'ACTIVE' ? '#fff' : theme.text }}>{activeStaff === 'Admin' ? `Incoming Requests (${pendingRequests.length})` : `Active Requests (${officerActiveRequests.length})`}</button>
              <button onClick={() => setInboxTab('HISTORY')} style={{ ...ui.btnPrimary, backgroundColor: inboxTab === 'HISTORY' ? theme.primary : theme.cardSubtle, color: inboxTab === 'HISTORY' ? '#fff' : theme.text }}>Resolved / History ({allHistoryLogs.length})</button>
            </div>
            {inboxTab === 'ACTIVE' && (
              <div>
                {activeStaff === 'Admin' ? (
                  pendingRequests.length === 0 ? <p style={{ color: theme.textMuted, textAlign: 'center' }}>No pending edit requests.</p> : pendingRequests.map(req => (
                    <div key={req.id} style={{ backgroundColor: theme.cardSubtle, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Survey #{req.id} — {req.headOfHousehold}</strong></div>
                      <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Requested by Officer: <strong>{req.editRequestedBy || 'Field Officer'}</strong></div>
                      <div style={{ backgroundColor: theme.card, padding: '10px', borderRadius: '8px', border: `1px solid ${theme.border}`, fontSize: '13px', marginBottom: '12px' }}><strong>Requested Changes:</strong> {req.editRequestReason}</div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleAdminAcceptAndEdit(req)} style={{ ...ui.btnPrimary, backgroundColor: theme.success }}>✓ Accept & Edit Record</button>
                        <button onClick={() => { setRejectingSurvey(req); setRejectionReasonText(''); }} style={{ ...ui.btnPrimary, backgroundColor: theme.danger }}>✕ Reject Request</button>
                      </div>
                    </div>
                  ))
                ) : (
                  officerActiveRequests.length === 0 ? <p style={{ color: theme.textMuted, textAlign: 'center' }}>No active requests.</p> : officerActiveRequests.map(req => (
                    <div key={req.id} style={{ backgroundColor: theme.cardSubtle, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Survey #{req.id} — {req.headOfHousehold}</strong><span style={ui.statusChip(req.editRequestStatus)}>{req.editRequestStatus}</span></div>
                      <p style={{ fontSize: '13px' }}><strong>Your Request:</strong> {req.editRequestReason}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {inboxTab === 'HISTORY' && (
              <div>
                {allHistoryLogs.length === 0 ? (
                  <p style={{ color: theme.textMuted, textAlign: 'center' }}>No resolved edit requests in history yet.</p>
                ) : (
                  allHistoryLogs.map(item => (
                    <div key={item.id} style={{ backgroundColor: theme.cardSubtle, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong>Survey #{item.surveyId} ({item.headOfHousehold})</strong>
                        <span style={ui.statusChip(item.status)}>
                          {item.status === 'Accepted' ? 'Resolved' : item.status === 'Rejected' ? 'Denied' : item.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '6px' }}>Officer: {item.officer}</div>
                      <div style={{ fontSize: '13px' }}><strong>Admin Remark:</strong> {item.adminRemarks}</div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {requestModalSurvey && (
        <div style={ui.modalOverlay}>
          <div style={ui.modalBox}>
            <h3 style={{ marginTop: 0 }}>Request Survey Edit</h3>
            <form onSubmit={handleOfficerRequestSubmit}>
              <label style={ui.label}>Fields & Details to Edit *</label>
              <textarea rows="4" style={{ ...ui.input, resize: 'vertical' }} value={requestReasonText} onChange={e => setRequestReasonText(e.target.value)} required />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}><button type="button" onClick={() => setRequestModalSurvey(null)} style={ui.btnIcon}>Cancel</button><button type="submit" style={ui.btnPrimary}>Send Request</button></div>
            </form>
          </div>
        </div>
      )}

      {rejectingSurvey && (
        <div style={ui.modalOverlay}>
          <div style={ui.modalBox}>
            <h3 style={{ marginTop: 0 }}>Reject Edit Request</h3>
            <form onSubmit={handleAdminRejectConfirm}>
              <label style={ui.label}>Rejection Reason / Feedback *</label>
              <textarea rows="3" style={{ ...ui.input, resize: 'vertical' }} value={rejectionReasonText} onChange={e => setRejectionReasonText(e.target.value)} required />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}><button type="button" onClick={() => setRejectingSurvey(null)} style={ui.btnIcon}>Cancel</button><button type="submit" style={{ ...ui.btnPrimary, backgroundColor: theme.danger }}>Confirm Rejection</button></div>
            </form>
          </div>
        </div>
      )}

      {editingSurvey && activeStaff === 'Admin' && (
        <div style={ui.modalOverlay}>
          <div style={ui.modalBox}>
            <h3 style={{ marginTop: 0 }}>Edit Comprehensive Survey Record</h3>
            <form onSubmit={handleEditSave}>
              <SurveyFormSections data={editingSurvey} setData={setEditingSurvey} ui={ui} theme={theme} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditingSurvey(null)} style={ui.btnIcon}>Cancel</button>
                <button type="submit" style={{ ...ui.btnPrimary, backgroundColor: theme.success }}>Save Changes & Approve</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;