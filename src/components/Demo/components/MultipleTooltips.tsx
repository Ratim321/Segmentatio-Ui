import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Region } from '../types';
import { ReportTooltip } from './ReportTooltip';

interface MultipleTooltipsProps {
  regions: Region[];
  hoveredRegion: string | null;
}

export function MultipleTooltips({ regions, hoveredRegion }: MultipleTooltipsProps) {
  return (
    <Tooltip.Provider>
      {regions.map((region) => (
        <Tooltip.Root key={region.id} open={hoveredRegion === region.id}>
          <Tooltip.Trigger asChild>
            <div className="absolute inset-0" />
          </Tooltip.Trigger>
          <ReportTooltip region={region} />
        </Tooltip.Root>
      ))}
    </Tooltip.Provider>
  );
}