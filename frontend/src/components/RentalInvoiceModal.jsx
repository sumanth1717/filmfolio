import React from 'react';
import { X, Printer, Film, ShieldCheck, Calendar, DollarSign, FileText } from 'lucide-react';

export default function RentalInvoiceModal({ reply, onClose }) {
  if (!reply) return null;

  const invoiceNumber = `INV-FF-${reply._id.substring(reply._id.length - 6).toUpperCase()}`;
  const invoiceDate = new Date(reply.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const dailyRate = reply.pricePerDay || 200;
  const days = reply.rentalDays || 1;
  const subtotal = reply.totalPrice || dailyRate * days;
  const deposit = Math.round(subtotal * 0.15);
  const totalAmount = subtotal + deposit;

  return (
    <div className="modal-overlay print-overlay" onClick={onClose}>
      <div className="modal-content invoice-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Top Controls Bar */}
        <div className="invoice-controls no-print">
          <button onClick={handlePrint} className="btn btn-primary btn-sm">
            <Printer size={16} /> Print / Save PDF Invoice
          </button>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            <X size={16} /> Close
          </button>
        </div>

        {/* Printable Document Sheet */}
        <div className="invoice-paper">
          {/* Header */}
          <div className="invoice-header">
            <div className="invoice-brand">
              <div className="brand-logo-icon">
                <Film size={26} className="text-amber" />
              </div>
              <div>
                <h2>FILMFOLIO PRODUCTION SERVICES</h2>
                <p>Peer-to-Peer Cinema Equipment Rental Contract & Receipt</p>
              </div>
            </div>

            <div className="invoice-meta-top">
              <span className="invoice-badge">CONFIRMED RENTAL AGREEMENT</span>
              <p><strong>Invoice #:</strong> {invoiceNumber}</p>
              <p><strong>Issue Date:</strong> {invoiceDate}</p>
            </div>
          </div>

          <hr className="divider" />

          {/* Party Details Grid */}
          <div className="parties-grid">
            <div className="party-box">
              <h4>LESSOR (Equipment Owner)</h4>
              <p className="party-name"><strong>{reply.receiver?.name || 'Owner'}</strong></p>
              <p>{reply.receiver?.email}</p>
              <p>Location: {reply.receiver?.location || 'Los Angeles, CA'}</p>
            </div>

            <div className="party-box">
              <h4>LESSEE (Renter / Producer)</h4>
              <p className="party-name"><strong>{reply.sender?.name || 'Renter'}</strong></p>
              <p>{reply.contactEmail || reply.sender?.email}</p>
              <p>Phone: {reply.contactPhone || 'Provided upon booking'}</p>
            </div>
          </div>

          {/* Rental Dates Summary */}
          <div className="dates-banner">
            <div className="date-col">
              <span className="label">PICKUP / START DATE</span>
              <strong>{reply.startDate || 'Immediate Pickup'}</strong>
            </div>

            <div className="date-col">
              <span className="label">RETURN / END DATE</span>
              <strong>{reply.endDate || 'Standard 1-Day Return'}</strong>
            </div>

            <div className="date-col">
              <span className="label">RENTAL DURATION</span>
              <strong>{days} Day(s)</strong>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th className="text-center">Daily Rate</th>
                <th className="text-center">Days</th>
                <th className="text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{reply.targetTitle}</strong>
                  <br />
                  <span className="item-subtext">Includes cinema flight case & standard accessories</span>
                </td>
                <td className="text-center">${dailyRate} / day</td>
                <td className="text-center">{days}</td>
                <td className="text-right">${subtotal}</td>
              </tr>
              <tr>
                <td>
                  <strong>Refundable Damage & Loss Security Deposit (15%)</strong>
                  <br />
                  <span className="item-subtext">Refunded immediately upon clean equipment inspection return</span>
                </td>
                <td className="text-center">—</td>
                <td className="text-center">—</td>
                <td className="text-right">${deposit}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="totals-section">
            <div className="total-row">
              <span>Subtotal Equipment Rental:</span>
              <span>${subtotal}</span>
            </div>
            <div className="total-row">
              <span>Refundable Deposit:</span>
              <span>${deposit}</span>
            </div>
            <div className="total-row grand-total">
              <span>Grand Total Amount Due:</span>
              <span>${totalAmount} USD</span>
            </div>
          </div>

          {/* Terms & Signature Lines */}
          <div className="terms-section">
            <h4><FileText size={14} /> Production Terms & Liability Agreement</h4>
            <p>
              The Lessee assumes full financial responsibility for loss, theft, or damage to the equipment during the rental period. Equipment must be tested upon pickup and returned in original working condition.
            </p>

            <div className="signatures-grid">
              <div className="sig-block">
                <div className="sig-line"></div>
                <p>Lessor Authorized Signature ({reply.receiver?.name})</p>
              </div>

              <div className="sig-block">
                <div className="sig-line"></div>
                <p>Lessee Authorized Signature ({reply.sender?.name})</p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .invoice-modal-content {
            max-width: 800px;
            padding: 2rem;
            background: #0f172a;
          }

          .invoice-controls {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
          }

          .invoice-paper {
            background: #141c2b;
            border: 1px solid var(--border-color);
            padding: 2.5rem;
            border-radius: var(--radius-md);
            color: #f8fafc;
          }

          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .invoice-brand {
            display: flex;
            align-items: center;
            gap: 0.85rem;
          }

          .brand-logo-icon {
            width: 48px; height: 48px;
            background: rgba(245, 158, 11, 0.15);
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: var(--radius-sm);
            display: flex; align-items: center; justify-content: center;
          }

          .invoice-brand h2 { font-size: 1.1rem; color: white; font-weight: 800; }
          .invoice-brand p { font-size: 0.8rem; color: var(--text-muted); }

          .invoice-meta-top { text-align: right; font-size: 0.85rem; color: var(--text-muted); }

          .invoice-badge {
            display: inline-block;
            background: rgba(16, 185, 129, 0.15);
            color: var(--emerald-success);
            border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 0.2rem 0.6rem;
            border-radius: 999px;
            font-size: 0.72rem;
            font-weight: 800;
            margin-bottom: 0.4rem;
          }

          .divider { border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0; }

          .parties-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem; }

          .party-box h4 { font-size: 0.8rem; color: var(--primary-amber); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
          .party-box p { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.2rem; }

          .dates-banner {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
            background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.2);
            padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; text-align: center;
          }

          .date-col .label { display: block; font-size: 0.72rem; color: var(--cyan-glow); font-weight: 700; margin-bottom: 0.2rem; }
          .date-col strong { color: white; font-size: 0.95rem; }

          .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
          .invoice-table th { background: rgba(255, 255, 255, 0.04); padding: 0.75rem 1rem; font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border-color); text-align: left; }
          .invoice-table td { padding: 1rem; font-size: 0.9rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: white; }
          .item-subtext { font-size: 0.78rem; color: var(--text-muted); }

          .text-center { text-align: center; }
          .text-right { text-align: right; }

          .totals-section { max-width: 320px; margin-left: auto; display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 2rem; }
          .total-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-muted); }
          .grand-total { font-size: 1.15rem; font-weight: 800; color: var(--primary-amber); padding-top: 0.5rem; border-top: 1px solid var(--border-color); margin-top: 0.4rem; }

          .terms-section { border-top: 1px solid var(--border-color); padding-top: 1.25rem; }
          .terms-section h4 { color: white; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.5rem; }
          .terms-section p { font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 2rem; }

          .signatures-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
          .sig-line { border-bottom: 1px solid var(--text-muted); height: 40px; margin-bottom: 0.5rem; }
          .sig-block p { font-size: 0.78rem; color: var(--text-muted); text-align: center; }

          @media print {
            .no-print { display: none !important; }
            .modal-overlay { position: static; background: none; }
            .invoice-modal-content { background: white !important; color: black !important; max-width: 100%; box-shadow: none; padding: 0; }
            .invoice-paper { background: white !important; color: black !important; border: none; }
            .invoice-brand h2, .party-name strong, .date-col strong, .invoice-table td, .grand-total, .terms-section h4 { color: black !important; }
            .invoice-table th { background: #f1f5f9 !important; color: #475569 !important; }
            .item-subtext, .invoice-meta-top, .party-box p, .terms-section p, .sig-block p { color: #64748b !important; }
            .dates-banner { background: #f8fafc !important; border-color: #cbd5e1 !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
