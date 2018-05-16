/************************************************************
Table View with sections 

Author: https://gist.github.com/licvido/a78f3714a7eda01b3c62
*************************************************************/

import UIKit

class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet var tableView: UITableView!
    
    var itemsInSections: Array<Array<String>> = [["1A", "1B", "1C"], ["2A", "2B"], ["3A", "3B", "3C", "3D", "3E"]]
    var sections: Array<String> = ["Section 1", "Section 2", "Section 3"]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.tableView.dataSource = self
        self.tableView.delegate = self
    }

    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return self.sections.count
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.itemsInSections[section].count
    }
    
    func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return self.sections[section]
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var cell = tableView.dequeueReusableCellWithIdentifier("cell") as UITableViewCell
        var text = self.itemsInSections[indexPath.section][indexPath.row]
        
        cell.textLabel!.text = text
        
        return cell
    }

}