package main

import "time"

const currTab = ".meat-tab[data-visible=true] "

func navigationFlow(r *runner) {
	must(r.waitForVisible("#user-menu"))

	r.logf("navigating to dashboard")
	must(r.click("section[data-path=dashboard]"))

	must(r.waitForVisible(".meat-tab[data-id=dashboard] .layout-picker"))
	must(r.click(currTab + ".layout-picker[data-layout='grid']"))

	r.logf("clearing filters if any")
	r.clickWithTimeout(currTab+".indicator-clear-filters", 1*time.Second)

	r.logf("checking grid is shown")
	must(r.waitForVisible(currTab + ".grid--cell"))

	r.logf("switching to table layout")
	must(r.click(currTab + ".layout-picker[data-layout='table']"))

	r.logf("checking table is shown")
	must(r.waitForVisible(currTab + ".table--row"))

	const firstTitleSelector = currTab + ".table--row .title--name"

	r.logf("sorting by name, A-Z")
	must(r.click(currTab + ".row--header.row--title"))
	r.logf("ensuring the A-Z sorting is correct")
	must(r.waitUntilTextExists(firstTitleSelector, "111 first"))

	r.logf("sorting by name, Z-A")
	must(r.click(currTab + ".row--header.row--title"))
	r.logf("ensuring the Z-A sorting is correct")
	must(r.waitUntilTextExists(firstTitleSelector, "zzz last"))
}
