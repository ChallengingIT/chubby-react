    import React from 'react';

    function useSmartRowsPerPage({
    containerRef,
    headerRef,
    theadRef,
    footerRef,
    rowProbeRef,
    fallbackRowHeight = 48
    }) {
    const [rowsPerPage, setRowsPerPage] = React.useState(4);

    React.useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const measure = () => {
        const total = el.clientHeight || 0;
        const headerH = headerRef.current?.offsetHeight || 0;
        const theadH  = theadRef.current?.offsetHeight  || 0;
        const footerH = footerRef.current?.offsetHeight || 0;
        const rowH = rowProbeRef.current?.getBoundingClientRect?.().height || fallbackRowHeight;

        const available = Math.max(total - headerH - footerH - theadH, 0);

        const rpp = Math.max(Math.floor(available / rowH), 1);
        setRowsPerPage(rpp);
        };

        const ro = new ResizeObserver(measure);
        ro.observe(el);
        if (headerRef.current) ro.observe(headerRef.current);
        if (footerRef.current) ro.observe(footerRef.current);
        if (theadRef.current)  ro.observe(theadRef.current);
        measure();

        return () => ro.disconnect();
    }, [containerRef, headerRef, theadRef, footerRef, rowProbeRef, fallbackRowHeight]);

    return rowsPerPage;
    }

    export default useSmartRowsPerPage;
