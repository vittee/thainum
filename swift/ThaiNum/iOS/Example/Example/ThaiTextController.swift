//
//  ThaiTextController.swift
//  Example
//
//  Created by Wittawas Nakkasem on 2/16/2558 BE.
//  Copyright (c) 2558 vittee. All rights reserved.
//

import UIKit
import ThaiNum

class ThaiTextController: UIViewController {
    
    
    @IBOutlet weak var label: UILabel!
    
    @IBAction func textFieldChanged(sender: UITextField) {
        label.text = ThaiNum.text(NSString(string: sender.text).doubleValue)
    }
}
