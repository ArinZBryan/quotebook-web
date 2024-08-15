import { useEffect, useState } from 'react';


function useToggle(defaultValue: boolean ) {
    const [value, setValue] = useState<boolean>(defaultValue);
    return {value: value, toggle: () => {setValue(!value)}};
};

export default useToggle;