/**
 * MIDI Device Selector Component
 *
 * Allows users to select and connect to MIDI input devices.
 * Shows connection status and available devices.
 */

import React, { useEffect, useState } from 'react';
import { useMidiStore } from '../store/useMidiStore';
import Button from './ui/Button';
import Select from './ui/Select';

interface MidiDeviceSelectorProps {
  className?: string;
  compact?: boolean;
}

// Icons
const MidiIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

const RefreshIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const WarningIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
);

const MidiDeviceSelector: React.FC<MidiDeviceSelectorProps> = ({
  className = '',
  compact = false,
}) => {
  const {
    connectionStatus,
    availableDevices,
    selectedDeviceId,
    error,
    requestAccess,
    selectDevice,
    disconnect,
    refreshDevices,
  } = useMidiStore();

  const [isConnecting, setIsConnecting] = useState(false);

  // Request MIDI access on mount
  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      handleConnect();
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    await requestAccess();
    setIsConnecting(false);
  };

  const handleDeviceChange = (deviceId: string) => {
    if (deviceId) {
      selectDevice(deviceId);
    }
  };

  const handleRefresh = () => {
    refreshDevices();
  };

  // Status indicator color
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return selectedDeviceId ? 'bg-success' : 'bg-warning';
      case 'requesting':
        return 'bg-warning animate-pulse';
      case 'error':
      case 'unsupported':
        return 'bg-error';
      default:
        return 'bg-neutral-300';
    }
  };

  // Status text
  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        if (selectedDeviceId) {
          const device = availableDevices.find((d) => d.id === selectedDeviceId);
          return device?.name || 'Verbunden';
        }
        return 'Kein Gerät ausgewählt';
      case 'requesting':
        return 'Verbinde...';
      case 'error':
        return 'Fehler';
      case 'unsupported':
        return 'Nicht unterstützt';
      default:
        return 'Nicht verbunden';
    }
  };

  // Convert devices to select options
  const deviceOptions = availableDevices.map((device) => ({
    value: device.id,
    label: `${device.name}${device.manufacturer ? ` (${device.manufacturer})` : ''}`,
  }));

  // Compact view for toolbar
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <MidiIcon className="w-4 h-4 text-neutral-600" />
        </div>

        {connectionStatus === 'connected' && availableDevices.length > 0 ? (
          <select
            value={selectedDeviceId || ''}
            onChange={(e) => handleDeviceChange(e.target.value)}
            className="text-sm bg-transparent border-none focus:outline-none cursor-pointer max-w-[250px] truncate"
            title={getStatusText()}
          >
            <option value="">MIDI wählen...</option>
            {deviceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting || connectionStatus === 'unsupported'}
            className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
          >
            {isConnecting ? 'Verbinde...' : 'MIDI verbinden'}
          </button>
        )}
      </div>
    );
  }

  // Full view
  return (
    <div className={`bg-white rounded-xl shadow-card p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              connectionStatus === 'connected' && selectedDeviceId
                ? 'bg-success/10'
                : 'bg-neutral-100'
            }`}
          >
            <MidiIcon
              className={`w-5 h-5 ${
                connectionStatus === 'connected' && selectedDeviceId
                  ? 'text-success'
                  : 'text-neutral-500'
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">MIDI-Eingang</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <span className="text-neutral-600">{getStatusText()}</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={
            connectionStatus !== 'connected' &&
            connectionStatus !== 'disconnected'
          }
          title="Geräte aktualisieren"
        >
          <RefreshIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 mb-4 p-3 bg-error/10 rounded-lg text-error text-sm">
          <WarningIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Unsupported browser message */}
      {connectionStatus === 'unsupported' && (
        <div className="text-sm text-neutral-600 mb-4">
          <p>
            Web MIDI wird nur in Chrome, Edge und Opera unterstützt. Bitte
            wechsle den Browser, um MIDI-Keyboards zu verwenden.
          </p>
        </div>
      )}

      {/* Device selector */}
      {connectionStatus === 'connected' && availableDevices.length > 0 && (
        <Select
          label="MIDI-Gerät"
          options={deviceOptions}
          value={selectedDeviceId || ''}
          onChange={handleDeviceChange}
          placeholder="Gerät auswählen..."
          fullWidth
        />
      )}

      {/* No devices found */}
      {connectionStatus === 'connected' && availableDevices.length === 0 && (
        <div className="text-center py-4 text-neutral-500">
          <p className="text-sm">Keine MIDI-Geräte gefunden.</p>
          <p className="text-sm mt-1">
            Schließe ein MIDI-Keyboard an und klicke auf Aktualisieren.
          </p>
        </div>
      )}

      {/* Connect button for disconnected state */}
      {connectionStatus === 'disconnected' && (
        <Button
          variant="primary"
          fullWidth
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? 'Verbinde...' : 'MIDI-Zugriff erlauben'}
        </Button>
      )}

      {/* Connected device info */}
      {connectionStatus === 'connected' && selectedDeviceId && (
        <div className="mt-4 flex items-center justify-between p-3 bg-success/10 rounded-lg">
          <div className="flex items-center gap-2 text-success">
            <CheckIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Bereit für Eingabe</span>
          </div>
          <button
            onClick={disconnect}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            Trennen
          </button>
        </div>
      )}
    </div>
  );
};

export default MidiDeviceSelector;
