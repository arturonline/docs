# Java y XML

Java ofereix moltes llibreries des d’on importar Document. Les llibreríes que anem a utilitzar per parsejar XMLs seran:

- La llibrería `java.xml.parsers.*` , que oferiran les classes **DocumentBuilderFactory** i **DocumentBuilder**.
- La llibrería `org.w3c.dom.*` per a la classe **Document**.

## Llegir XML

Exemple:

```xml
<curs>
    <modul>
        <nom>Accés a Dades</nom>
        <hores>6</hores>
        <qualificacio>8.45</qualificacio>
    </modul>
    <modul>
        <nom>Programació de serveis i processos</nom>
        <hores>3</hores>
        <qualificacio>9.0</qualificacio>
    </modul>
    <modul>
        <nom>Desenvolupament d'interfícies</nom>
        <hores>6</hores>
        <qualificacio>8.0</qualificacio>
    </modul>
    <modul>
        <nom>Programació Multimédia i dispositiud mòbils</nom>
        <hores>5</hores>
        <qualificacio>7.34</qualificacio>
    </modul>
    <modul>
        <nom>Sistemes de Gestió Empresarial</nom>
        <hores>5</hores>
        <qualificacio>8.2</qualificacio>
    </modul>
    <modul>
        <nom>Empresa i iniciativa emprenedora</nom>
        <hores>3</hores>
        <qualificacio>7.4</qualificacio>
    </modul>
</curs>
```

### #1 Obrir documents XML

```java
public Document ObreXML(String nom) throws IOException,SAXException,
    ParserConfigurationException, FileNotFoundException {

    // Creem una instància de DocumentBuilderFactory
    DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
    // Amb la instància de DocumentBuilderFactory creem un DocumentBuilder
    DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
    //I utilitzem el métode "parse" de DocumentBuilder per obtindre el document
    Document doc = dBuilder.parse(new File(nom));

    return doc;
    }
```

Simplificat sense utilitzar les declaracions intermitges:

```java
public Document ObreXML(String nom) throws IOException,SAXException,
    ParserConfigurationException, FileNotFoundException {
        return DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(nom);
}
```

### #2 Llegir XML

```java
//rep un element de tipus Document (tal com ens el retorna ObreXML ) i mostrarà el seu contingut per pantalla
public void MostraXML(Document doc) throws IOException {
    // obtenir l’arrel del document
    Element arrel = doc.getDocumentElement();
    System.out.println(arrel.getTextContent()); // Amb aquest element arrel, ja podríem mostrar tot el contingut amb getTextContent()

    // Obtindrem una llista de nodes (Pas 1)
    NodeList moduls = arrel.getElementsByTagName("modul");

    // Per a cada node (Pas 2)
    for (int i = 0; i < moduls.getLength(); i++) {
        Element el = (Element) moduls.item(i);

        // Mostra el nom del node (Pas 3)
        System.out.println(el.getNodeName() + " " + (i + 1));

        // I mostrem el valor de les diferents etiquetes (Passos 4, 5 i 6)

        System.out.println("Nom: " + el.getElementsByTagName("nom").item(0).getFirstChild().getNodeValue());

        System.out.println("Hores: " + el.getElementsByTagName("hores").item(0).getFirstChild().getNodeValue());
        System.out.println("Qualificació: " + el.getElementsByTagName("qualificacio").item(0).getFirstChild().getNodeValue());
        System.out.println();
    }
}
```

### #3: Escriure XML

Anem ara a la part d’escriptura dels documents XML. Pera això, partirem d’un fitxer que ja conté la informació en format binari dels mòduls, el llegirem, i importarem la seua informació a format XML.

```java
public void ImportaObj(String fitxer) throws IOException, ParserConfigurationException, ClassNotFoundException, TransformerException {

    // llegim el fitxer d'entrada
    ObjectInputStream f = new ObjectInputStream(new FileInputStream(fitxer));

    // Creem un Document XML buit
    Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();

    // Creem l'element arrel i l'afegim al document
    Element arrel = doc.createElement("curs");
    doc.appendChild(arrel);

    // anirem llegint el fitxer d’objectes amb el mètode readObject de File:
    Modul m;
    m = (Modul) f.readObject();

    // Una vegada hem llegit un objecte, crearem l’etiqueta que engloba a cadascun d’ells: l’etiqueta mòdul:
    Element modul = doc.createElement("modul");

    // I dins d’ella, i a mesura que extraiem les diferents propietats de l’objecte Modul , anirem creant nodes fills i afegint-los al mòdul. Per exemple, per al nom del mòdul:
    Element nom = doc.createElement("nom");
    nom.appendChild(doc.createTextNode(m.getModul()));
    modul.appendChild(nom);

    // Haurem de fer el mateix per a les hores de cada mòdul i la qualificació dins un bucle que llisca tot el fitxer d’objectes.
    Element hores = doc.createElement("hores");
    hores.appendChild(doc.createTextNode(Integer.toString(m.getHores())));
    modul.appendChild(hores);
    Element qualificacio = doc.createElement("qualificacio");
    qualificacio.appendChild(doc.createTextNode(Double.toString(m.getNota())));
    modul.appendChild(qualificacio);

    // Una vegada tinguem llegit cadascun dels mòduls, els haurem d’afegir a l’element arrel amb:
    arrel.appendChild(modul);

    // Ara ens quedaría convertir aquest objecte de tipus Element en una cadena de text per tal de poder escriure’l al disc. Per això farem ús de la utilitat Transformer .
    Transformer trans = TransformerFactory.newInstance().newTransformer();
    DOMSource source = new DOMSource(doc);
    StreamResult result = new StreamResult(new FileOutputStream(fitxer + ". xml"));
    trans.transform(source, result);
}
```

> La classe Transformer treballa amb dos tipus **adaptadors**. Els adaptadors són classes que fan compatibles jerarquies diferents. Aquests adaptadors són **Source** i **Result** . Les classes que implementen aquests adaptadors s’encarregaran de fer compatibles els diferents tipus de contenidors al que requerisca la classe Transformer . Així doncs, i per clarificar, disposem de les classes `DOMSource` , `SAXSource` o `StreamSource` , que són adaptadors del contenidor de la font d’informació per a DOM, SAX o Stream; i de `DOMResult` , `SAXResult` i `StreamResult` com a adaptadors equivalents al contenidor destí.

## Binding XML

La tècnica del Binding consisteix a generar classes Java amb formats concrets, com per exemple XML, de manera que cada etiqueta o atribut d’XML es correspon amb una propietat de certa classe. Aquesta correspondència s’anomena mapat.

Les anotacions són classes especials de Java que permeten associar informació i funcionalitat als objectes, sense interferir en l’estructura del model de dades. Les anotacions poden associar-se a un paquet, a una classe, a un atribut o a un paràmetre, i es declaren amb el símbol @ davant del nom de l’anotació. Quan el compilador detecta una anotació, crea una instància i la injecta dins l’element afectat, sense interferir en la classe en sí. Quan una aplicació necessita de la informació de les anotacions, poden obtenir la instància injectada.

Per exemple, en la classe Mòdul que teníem definida:

```java
@XmlRootElement
class Modul {

    String nom;
    int hores;
    double nota;

    public String getNom() { return nom; }

    @XmlElement
    public void setNom(String nom) { this.nom = nom; }
    public int getHores() { return hores; }

    @XmlElement
    public void setHores(int hores) { this.hores = hores; }
    public double getNota() { return nota; }

    @XmlElement
    public void setNota(double nota) { this.nota = nota;}
}
```
