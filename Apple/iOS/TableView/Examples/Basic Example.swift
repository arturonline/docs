/************************************************************
Table View with sections 2

Author: https://forums.bignerdranch.com/t/solution-for-ch-10-bronze-silver-and-gold-challenge/11310
*************************************************************/

class ItemsViewController: UITableViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //get the height of the status bar
        let statusBarHeight = UIApplication.shared.statusBarFrame.height
        
        let insets = UIEdgeInsets(top: statusBarHeight, left: 0, bottom: 0, right: 0)
        tableView.contentInset = insets
        tableView.scrollIndicatorInsets = insets
    }
    
    var itemStore: ItemStore! // model
    
    // number of sections
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 2
    }
    
    // title for every section
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case 0:
            return "More than $50"
        default:
            return "Others"
        }
    }

    //number of rows per section 
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0:
            return itemStore.itemsGreaterThan50.count
        default
            return itemStore.itemsLessThanEqualTo50.count

        }
    }

    // format the cell
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        // Create an instance of UITableViewCell, with default appearance
        let cell = tableView.dequeueReusableCell(withIdentifier: "UITableViewCell", for: indexPath)
        
        // Get the corresponding objects from the model
        let items: [Item]
        switch indexPath.section {
        case 0:
            items = itemStore.itemsGreaterThan50
        default:
            items = itemStore.itemsLessThanEqualTo50
        }
        
        let item = items[indexPath.row]

        // Set the text on the cell with the description of the item
        // that is at the nth index of items, where n = row this cell
        // will appear in on the tableview

        cell.textLabel?.text = item.name
        cell.detailTextLabel?.text = "\(item.valueInDollars)"
        cell.textLabel?.font = UIFont.systemFont(ofSize: 20)
        cell.detailTextLabel?.font = UIFont.systemFont(ofSize: 20)
        
        return cell
    }

}
