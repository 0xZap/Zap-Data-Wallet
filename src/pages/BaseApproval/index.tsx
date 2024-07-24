import React, { ReactElement, ReactNode } from "react";
import ZapButton from "../../components/ZapButton";

export function BaseApproval({
  onSecondaryClick,
  onPrimaryClick,
  header,
  children,
  secondaryCTAText = "Cancel",
  primaryCTAText = "Accept",
}: {
  header: ReactNode;
  children: ReactNode;
  onSecondaryClick: () => void;
  onPrimaryClick: () => void;
  secondaryCTAText?: string;
  primaryCTAText?: string;
}): ReactElement {
  return (
    <div className="absolute flex flex-col items-center w-screen h-screen bg-darkcolor gap-2 cursor-default">
      <div className="w-full py-2 px-4 border-b border-graycolor text-lightcolor shadow-lg">
        <div className="flex flex-row items-end justify-start gap-2">
          {/* <img className="h-5" src={logo} alt="logo" /> */}
          <span className="font-semibold">{header}</span>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-2 overflow-y-auto w-full">
        {children}
      </div>
      <div className="flex flex-row w-full gap-6 p-6">
        {!!onSecondaryClick && !!secondaryCTAText && (
          <ZapButton
            className="flex-1 py-2 text-darkcolor"
            onClick={onSecondaryClick}
          >
            {secondaryCTAText}
          </ZapButton>
        )}
        {!!onPrimaryClick && !!primaryCTAText && (
          <ZapButton
            className="flex-1 py-2 text-darkcolor"
            onClick={onPrimaryClick}
          >
            {primaryCTAText}
          </ZapButton>
        )}
      </div>
    </div>
  );
}
