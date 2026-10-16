import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { OperationsIcon } from '../components/OperationsIcons'
import { FacilityDirectoryTab } from '../components/FacilityDirectoryTab'
import { RentalPoliciesTab } from '../components/RentalPoliciesTab'
import { PricingFeesTab } from '../components/PricingFeesTab'
import { PerformanceAnalyticsTab } from '../components/PerformanceAnalyticsTab'
import { SystemReportsTab } from '../components/SystemReportsTab'
import {
  loadOperationsData,
  saveOperationsData,
  type OperationsState,
  type FacilityItem,
  type RentalPolicyConfig,
  type PricingTier,
  type AdditionalFee,
  type PromotionPolicy,
} from '../model/operationsDomain'

export default function OperationsDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'facilities'
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  const [opsData, setOpsData] = useState<OperationsState>(() => loadOperationsData())

  useEffect(() => {
    saveOperationsData(opsData)
  }, [opsData])

  useEffect(() => {
    const title = document.title
    document.title = 'Quản lý Vận hành Kinh doanh (BOM) — SelfStorage'
    return () => {
      document.title = title
    }
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  // Facility handlers
  const handleAddFacility = (item: Omit<FacilityItem, 'id'>) => {
    const id = `fac-${Math.floor(100 + Math.random() * 900)}`
    setOpsData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, { ...item, id }],
    }))
  }

  const handleUpdateFacility = (item: FacilityItem) => {
    setOpsData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === item.id ? item : f)),
    }))
  }

  // Policy handlers
  const handleAddPolicy = (policy: Omit<RentalPolicyConfig, 'id' | 'lastUpdated'>) => {
    const id = `pol-${Math.floor(100 + Math.random() * 900)}`
    const now = new Date().toISOString().slice(0, 10)
    setOpsData((prev) => ({
      ...prev,
      policies: [...prev.policies, { ...policy, id, lastUpdated: now }],
    }))
  }

  const handleUpdatePolicy = (policy: RentalPolicyConfig) => {
    setOpsData((prev) => ({
      ...prev,
      policies: prev.policies.map((p) => (p.id === policy.id ? policy : p)),
    }))
  }

  // Pricing & Fee handlers
  const handleUpdatePricingTier = (tier: PricingTier) => {
    setOpsData((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((t) => (t.id === tier.id ? tier : t)),
    }))
  }

  const handleAddAdditionalFee = (fee: Omit<AdditionalFee, 'id'>) => {
    const id = `fee-${Math.floor(100 + Math.random() * 900)}`
    setOpsData((prev) => ({
      ...prev,
      additionalFees: [...prev.additionalFees, { ...fee, id }],
    }))
  }

  const handleUpdateAdditionalFee = (fee: AdditionalFee) => {
    setOpsData((prev) => ({
      ...prev,
      additionalFees: prev.additionalFees.map((f) => (f.id === fee.id ? fee : f)),
    }))
  }

  const handleAddPromotion = (promo: Omit<PromotionPolicy, 'id' | 'usageCount'>) => {
    const id = `promo-${Math.floor(100 + Math.random() * 900)}`
    setOpsData((prev) => ({
      ...prev,
      promotions: [...prev.promotions, { ...promo, id, usageCount: 0 }],
    }))
  }

  const handleUpdatePromotion = (promo: PromotionPolicy) => {
    setOpsData((prev) => ({
      ...prev,
      promotions: prev.promotions.map((p) => (p.id === promo.id ? promo : p)),
    }))
  }

  const tabs = [
    {
      id: 'facilities',
      label: 'Danh sách cơ sở',
      icon: 'building',
      count: opsData.facilities.length,
    },
    {
      id: 'policies',
      label: 'Chính sách cho thuê',
      icon: 'policy',
      count: opsData.policies.length,
    },
    {
      id: 'pricing',
      label: 'Khung giá & Biểu phí',
      icon: 'pricing',
      count: opsData.pricingTiers.length,
    },
    {
      id: 'performance',
      label: 'Doanh thu & Hiệu suất',
      icon: 'analytics',
    },
    {
      id: 'reports',
      label: 'Xem & Xuất báo cáo',
      icon: 'report',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-16 antialiased">
      {/* Top Application Bar - Strictly 1 single row */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 whitespace-nowrap">
          {/* Left Brand & Portal identity */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-900 font-extrabold text-lg tracking-tight hover:text-blue-600 transition shrink-0 whitespace-nowrap"
            >
              <span className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                S
              </span>
              <span className="whitespace-nowrap">
                SelfStorage<span className="text-blue-600">.</span>
              </span>
            </Link>
            <span className="text-slate-300 select-none">/</span>
            <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
              <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                Phân hệ Quản lý
              </span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 whitespace-nowrap shrink-0">
                Business Operations Manager (BOM)
              </span>
            </div>
          </div>

          {/* Right Scope, User Profile & Back to Home */}
          <div className="flex items-center gap-4 shrink-0 whitespace-nowrap">
            <div className="hidden lg:flex items-center gap-3 text-xs border-r border-slate-200 pr-4 whitespace-nowrap shrink-0">
              <span className="text-slate-500 whitespace-nowrap">
                Phạm vi: <strong className="text-slate-800 font-semibold whitespace-nowrap">Toàn quốc (Nationwide)</strong>
              </span>
              <span className="text-slate-300 select-none">•</span>
              <span className="text-slate-500 whitespace-nowrap">
                Phụ trách: <strong className="text-slate-900 font-semibold whitespace-nowrap">Lê Nguyễn Quốc Khương</strong>
              </span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">Về Trang chủ</span>
              <span aria-hidden="true" className="text-slate-400">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-7 space-y-6">
        {/* Page Title & Context Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-1">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
              QUẢN LÝ VẬN HÀNH & KINH DOANH TOÀN HỆ THỐNG
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Bảng điều khiển Giám đốc Vận hành (BOM)
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 max-w-2xl leading-relaxed">
              Quản lý danh sách các cơ sở kho, thiết lập chính sách cho thuê chung, kiểm soát khung giá thuê & biểu phí, theo dõi doanh thu và xuất báo cáo toàn hệ thống.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              {opsData.facilities.length} cơ sở đang kết nối trực tuyến
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav
          aria-label="Operations navigation tabs"
          className="border-b border-slate-200 flex space-x-1 sm:space-x-2 overflow-x-auto pb-px"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <OperationsIcon
                  name={tab.icon}
                  size={16}
                  className={isActive ? 'text-blue-600' : 'text-slate-400'}
                />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[11px] font-normal text-slate-400 ml-0.5">({tab.count})</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Active Tab Panel */}
        <div className="pt-2">
          {activeTab === 'facilities' && (
            <FacilityDirectoryTab
              facilities={opsData.facilities}
              onAddFacility={handleAddFacility}
              onUpdateFacility={handleUpdateFacility}
            />
          )}

          {activeTab === 'policies' && (
            <RentalPoliciesTab
              policies={opsData.policies}
              onAddPolicy={handleAddPolicy}
              onUpdatePolicy={handleUpdatePolicy}
            />
          )}

          {activeTab === 'pricing' && (
            <PricingFeesTab
              pricingTiers={opsData.pricingTiers}
              additionalFees={opsData.additionalFees}
              promotions={opsData.promotions}
              onUpdatePricingTier={handleUpdatePricingTier}
              onAddAdditionalFee={handleAddAdditionalFee}
              onUpdateAdditionalFee={handleUpdateAdditionalFee}
              onAddPromotion={handleAddPromotion}
              onUpdatePromotion={handleUpdatePromotion}
            />
          )}

          {activeTab === 'performance' && (
            <PerformanceAnalyticsTab facilities={opsData.facilities} />
          )}

          {activeTab === 'reports' && (
            <SystemReportsTab facilities={opsData.facilities} />
          )}
        </div>
      </main>
    </div>
  )
}