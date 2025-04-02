'use client'
import {useEffect, useState} from "react"; 
import useStore from "../store";


const SettingsModal = ({modalOpen, setModalOpen}: {modalOpen: boolean, setModalOpen: (open: boolean) => void}) => { 
    const setSettings = useStore(state => state.setSettings);
    const settings = useStore(state => state.settings);
    return (
        <div className={`fixed inset-0 bg-activeBackground backdrop-blur-lg bg-opacity-50 z-50 ${modalOpen ? "" : "hidden"}`}>
            <div className="flex flex-col justify-center items-center h-full">
                <div className="bg-secondaryBackground p-4 rounded-lg shadow-lg w-1/3">
                    <h2 className="text-xl font-bold text-foreground">Settings</h2>
                    <div className="mt-4">
                        <label className="flex items-center">
                            <input 
                                type="checkbox" 
                                checked={settings.switchOrientation} 
                                onChange={(e) => setSettings({...settings, switchOrientation: e.target.checked})} 
                            />
                            <span className="ml-2 text-sm text-foreground">Switch Orientation</span>
                        </label>
                    </div>
                    <button 
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" 
                        onClick={() => setModalOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )

}
export default SettingsModal; 