/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package resumeanalize;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.Driver;
import com.mysql.jdbc.Statement;
import com.sun.corba.se.spi.activation.Server;
import java.io.*;
import java.net.*;
import java.sql.*;
import javax.sql.*;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.logging.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;

/**
 *
 * @author V  L  A  D
 */
public class Parser {

    private static ArrayDeque<String> urlList = new ArrayDeque<String>();

    private String domenii[] =
 {
        "Finante",
        "Inginerie",
        "Institutii",
        "IT",
        "Management",
        "Marketing",
        "Muncitori",
        "OfficeJobs",
        "Sanatate",
        "Servicii",
        "Studenti",
        "Vanzari"
    };

    private String subdomenii[] =
 {
        "Asigurari",
        "Audit",
        "Consultanta",
        "Banci",
        "Financiar",
        "Contabilitate",
        "Vanzari",
        "Agricultura",
        "Automobile",
        "Cercetare",
        "Constructii",
        "Electrica",
        "Mecanica",
        "Naval",
        "Aviatie",
        "Protectia mediului",
        "Arhitectura",
        "Design",
        "Cultura",
        "Arta",
        "Educatie",
        "Fundatii",
        "Asociatii",
        "ONG",
        "Juridic",
        "Traduceri",
        "Training",
        "Electronice",
        "Inginerie",
        "Internet",
        "Media",
        "Hardware",
        "Project management",
        "Software",
        "Programare",
        "Suport",
        "Telecomunicatii",
        "Vanzari",
        "Webdesign",
        "Product Management",
        "Copywriting",
        "Hostess",
        "Promoteri",
        "PR",
        "Publicitate",
        "Piscicultura",
        "Silvicultura",
        "Instalatii",
        "Amenajari",
        "Service",
        "Instalare",
        "Soferi",
        "Achizitii",
        "Administrativ",
        "Aprovizionare",
        "Logistica",
        "Resurse umane",
        "Psihologie",
        "Secretariat",
        "Chimie",
        "Biochimie",
        "Farmacii",
        "Medicina",
        "Sanatate",
        "Stomatologie",
        "Entertainment",
        "Hoteluri",
        "Intretinere",
        "Sport",
        "Paza",
        "Protectie",
        "Restaurante",
        "Transport",
        "Turism",
        "Imobiliare",
        "Retail"        
    };

    private Connection dbcon = null;

    void baga(String token, String domeniu)
    {
        if (token.contains("'")) return;
        if (token.contains("\"")) return;
        if (token.length() > 50) return;
        if (token.length() < 2 || !Character.isLetter(token.charAt(0))) return;
        try {
            Statement stm = (Statement) dbcon.createStatement();
            stm.executeUpdate("INSERT INTO words VALUES('" + token + "','" + domeniu + "', 0) ON DUPLICATE KEY UPDATE nr = nr+1");
            stm.close();
            //System.out.println(token + " " + domeniu);
        } catch (Exception ex) {
            Logger.getLogger(Parser.class.getName()).log(Level.SEVERE, null, ex);
        }


    }

    void sparge(String what, ArrayList<String> domenii, ArrayList<String> subdomenii)
    {
        String[] res = what.split("\\s");
        
        for (int j=0; j<res.length; ++j)
        {
            String token = res[j];            
            for (int i=0; i<domenii.size(); ++i)
                baga(token, domenii.get(i));
            
            for (int i=0; i<subdomenii.size(); ++i)
                baga(token, subdomenii.get(i));
        }
    }


    void init()
    {
        try
       {

           Class.forName ("com.mysql.jdbc.Driver");
           dbcon = (Connection) DriverManager.getConnection ("jdbc:mysql://127.0.0.1:3306/pip","root","1234");
       }
       catch (Exception e)
       {
           e.printStackTrace();

       }

    }

    void parse()
    {
        init();
    //starting adresses
        urlList.add("http://www.bestjobs.ro/cautare/locuri-de-munca/pag-146");

        //start crawling
        while (!urlList.isEmpty())
        {
            String adress = urlList.removeFirst();

            System.out.println("Crawling " + adress);

            try
            {
                //connect to the url
                HttpURLConnection con = (HttpURLConnection) new URL(adress).openConnection();

                //get the page
                BufferedReader page = new BufferedReader(
                                new InputStreamReader(
                                con.getInputStream()));

                //parse the page
                String aux;
                String inputLine = "";
                while ((aux = page.readLine()) != null)
                    inputLine += aux;
                

                    //get the next page link
                    Pattern p = Pattern.compile("href='([^']*?)'><span>Urmatoarele");
                    Matcher m = p.matcher(inputLine);
                    m.find();
                    {
                        String link = m.group(1);
                        urlList.add(link);
                    }
                    System.out.println("A");
                    //parse the offers
                    p = Pattern.compile("<a class=\"sr-cell-title\" href=\"([^\"]*?)\"");
                    m = p.matcher(inputLine);
                    while (m.find())
                    {
                        String link = m.group(1);

                        System.out.println(link);

                        HttpURLConnection offer = (HttpURLConnection) new URL(link).openConnection();
                        //get the page
                        BufferedReader offerpage = new BufferedReader(
                                new InputStreamReader(
                                offer.getInputStream()));

                        //parse the page
                        String content = "";
                        while ((aux = offerpage.readLine()) != null)
                            content += aux;
                        
                        Pattern pp = Pattern.compile("<h1 style=\"margin-bottom: -13px;\">([^<]*?)</h1><br />");
                        Matcher mm = pp.matcher(content);

                        //titlu
                        String curTitlu = "";
                        if (mm.find())                        
                            curTitlu = mm.group(1);                        

                        ArrayList<String> curDomenii = new ArrayList<String>();
                        ArrayList<String> curSubDomenii = new ArrayList<String>();
                        String curContent = null;

                        //domeniu
                        for (int i=0; i<domenii.length; ++i)
                        {
                            String tofind = "<strong>"+domenii[i]+"</strong>";
                            if (content.contains(tofind))
                                curDomenii.add(domenii[i]);
                        }

                        //subdomeniu
                        for (int i=0; i<subdomenii.length; ++i)
                        {
                            String tofind = subdomenii[i];
                            if (content.contains(tofind))
                                curSubDomenii.add(subdomenii[i]);
                        }

                        //content
                        pp = Pattern.compile("<h1 style=\"margin-bottom: -13px;\">(.*?)</html>");
                        mm = pp.matcher(content);
                        if (!mm.find()) continue;
                        curContent = mm.group(1);                        
                        
                        curContent = curContent.split("Trimite mai departe")[0];
                        
                        //convert everything to lowercase
                        curTitlu = curTitlu.toLowerCase();

                        curContent = Jsoup.parse(curContent).text();
                        curContent = curContent.toLowerCase();

                        //baga in baza
                        for (int i=0; i<3; ++i)
                            sparge(curTitlu, curDomenii, curSubDomenii);
                        sparge(curContent, curDomenii, curSubDomenii);

                        offerpage.close();
                    }
                    

                page.close();

                //done
                System.out.println("Done");
            }
            catch(Exception e)
            {
                //System.out.println("Eroare la accesarea " + adress);
            }
        }
    }

}
