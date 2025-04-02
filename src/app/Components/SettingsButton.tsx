'use client'
import { Gear } from "@phosphor-icons/react";

const SettingsButton = ({setModalOpen}: {modalOpen?: boolean, setModalOpen: (open: boolean) => void}) => { 
    return (
        <button className="fixed bottom-8 cursor-pointer right-8 text-2xl text-foreground font-semibold py-2 px-4" onClick={() => { 
            setModalOpen(true); 
            document.body.style.overflow = "hidden";
        }}>
            <Gear size={32} weight="bold" />
        </button>
    );
}
export default SettingsButton;